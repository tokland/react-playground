import React from "react";
import _ from "lodash";
import { Selector, SetState, Store, useStoreSet, useStoreState } from "./StoreState";
import { Action, BuildReducer } from "../libs/reducer";

export function getStoreHooks<State, Reducer extends BuildReducer<State>>(
    initialState: State,
    reducer: Reducer
) {
    const store = new Store(initialState);

    function useState<SelectedState>(selector: Selector<State, SelectedState>) {
        return useStoreState(store, selector);
    }

    function useActions() {
        const setState = useStoreSet(store);

        const actions = React.useMemo(() => {
            return getEffectActions(reducer, setState, {
                get: state => state,
                set: (_prevStateA, newStateA: State) => newStateA,
            });
        }, [setState]);

        return actions;
    }

    return { useState, useActions };
}

export type ReducerBase = BuildReducer<any>;

type ReplaceNested<Nested, State> = Nested extends BuildReducer<State>
    ? Replace<State, Nested>
    : never;

type Replace<State, Reducer extends BuildReducer<State>> = ActionsToEffects<Reducer["actions"]> & {
    [N in keyof Reducer["nested"] & keyof State]: ReplaceNested<Reducer["nested"][N], State[N]>;
};

type ActionsToEffects<Actions> = {
    [A in keyof Actions]: Actions[A] extends (...args: infer Args) => (state: any) => any
        ? (...args: Args) => void
        : never;
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
