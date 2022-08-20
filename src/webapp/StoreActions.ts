import React from "react";
import _ from "lodash";
import { Selector, SetState, Store, useContextState } from "./StoreState";

export function getActionsStore<State, Reducer extends BuildReducer<State>>(
    initialState: State,
    reducer: Reducer
) {
    const store = new Store(initialState);

    return function <SelectedState>(selector: Selector<State, SelectedState>) {
        const [selectedState, setState] = useContextState(store, selector);

        const actions = React.useMemo(() => {
            return getEffectActions(reducer, setState, {
                get: state => state,
                set: (_prevStateA, newStateA: State) => newStateA,
            });
        }, [setState]);

        return [selectedState, actions] as const;
    };
}

type BaseObj<State> = Record<string, Action<State> | BuildReducer<any>>;

type BuildReducerFromMixedObj<State, Obj extends BaseObj<State>> = {
    actions: Get<Obj, Action<State>>;
    nested: Get<Obj, BuildReducer<any>>;
};

export function buildReducer<State>() {
    return function <Obj extends Record<string, Action<State> | BuildReducer<any>>>(obj: Obj) {
        const actionKeys: Array<keyof Obj> = _(obj)
            .toPairs()
            .map(([key, value]) => (typeof value === "function" ? key : null))
            .compact()
            .value();

        return {
            actions: _.pick(obj, actionKeys),
            nested: _.omit(obj, actionKeys),
        } as unknown as BuildReducerFromMixedObj<State, Obj>;
    };
}

type Id<T> = { [K in keyof T]: T[K] } | never;

type Get<T, S> = Id<Pick<T, { [K in keyof T]: T[K] extends S ? K : never }[keyof T]>>;

type Action<State> = (...args: any[]) => (state: State) => State;

type ActionsBase<State> = Record<string, Action<State>>;

type NestedBase<State> = { [K in keyof State]?: BuildReducer<State[K]> };

type ReducerBase = BuildReducer<any>;

interface BuildReducer<State> {
    actions: ActionsBase<State>;
    nested: NestedBase<State>;
}

type ActionsToEffects<Actions> = {
    [A in keyof Actions]: Actions[A] extends (...args: infer Args) => (state: any) => any
        ? (...args: Args) => void
        : never;
};

type ReplaceNested<Nested, State> = Nested extends BuildReducer<State>
    ? Replace<State, Nested>
    : never;

type Replace<State, Reducer extends BuildReducer<State>> = ActionsToEffects<Reducer["actions"]> & {
    [N in keyof Reducer["nested"] & keyof State]: ReplaceNested<Reducer["nested"][N], State[N]>;
};

function getEffectActions<Reducer extends ReducerBase, StateA, StateB>(
    reducer: Reducer,
    setState: SetState<StateA>,
    lens: {
        get: (stateA: StateA) => StateB;
        set: (stateA: StateA, stateB: StateB) => StateA;
    }
): Replace<StateA, Reducer> {
    const innerActions = _.mapValues(reducer.actions, (actionB: Action<StateB>) => {
        return (...args: Parameters<typeof actionB>[0]) => {
            setState(stateA => {
                const stateB = lens.get(stateA);
                const updaterB = actionB(...args);
                const newStateB = updaterB(stateB);
                return lens.set(stateA, newStateB);
            });
        };
    });

    type ReducerC = NonNullable<Reducer["nested"][keyof Reducer["nested"]]>;

    const nestedActions = _.mapValues(reducer.nested, (reducerC: ReducerC, key: keyof StateB) => {
        return getEffectActions(reducerC, setState, {
            get: stateA => {
                const stateB = lens.get(stateA);
                return stateB[key];
            },
            set: (stateA, newStateC) => {
                const stateB = lens.get(stateA);
                const newStateB = { ...stateB, [key]: newStateC } as StateB;
                return lens.set(stateA, newStateB);
            },
        });
    });

    return { ...innerActions, ...nestedActions } as unknown as Replace<StateA, Reducer>;
}
