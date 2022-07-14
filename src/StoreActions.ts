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

export function buildReducer<State>() {
    return function <Actions extends ActionsBase<State>, Nested extends NestedBase<State>>(
        actions: Actions,
        nested?: Nested
    ): { actions: Actions; nested: Nested } {
        return { actions, nested: nested || ({} as Nested) };
    };
}

type GetReducerState<R extends ReducerBase> = R extends BuildReducer<infer State> ? State : never;

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

type ReplaceNested<Nested, State> = Nested extends BuildReducer<State> ? Replace<Nested> : never;

type Replace<
    Reducer extends ReducerBase,
    State = GetReducerState<Reducer>,
    Nested = Reducer["nested"]
> = ActionsToEffects<Reducer["actions"]> & {
    [N in keyof Nested & keyof State]: ReplaceNested<Nested[N], State[N]>;
};

export function getEffectActions<Reducer extends ReducerBase, StateA, StateB>(
    reducer: Reducer,
    setState: SetState<StateA>,
    lens: {
        get: (stateA: StateA) => StateB;
        set: (stateA: StateA, stateB: StateB) => StateA;
    }
): Replace<Reducer> {
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

    return { ...innerActions, ...nestedActions } as unknown as Replace<Reducer>;
}
