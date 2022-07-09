import React from "react";
import { appContext } from "./App";
import { AppStateReducer, AppState, getRandom } from "./AppState";
import { Selector, SetState, StateContext, useContextState } from "./StateContext";

const appActions = buildActions<AppState>()(setState => ({
    decrement: () => setState(state => new AppStateReducer(state).add(-1)),
    increment: () => setState(state => new AppStateReducer(state).add(+1)),
    addRandom: async () => {
        const randomValue = await getRandom();
        setState(state => new AppStateReducer(state).add(randomValue));
    },
}));

const appActionsFunctional = {
    incrementF: () => sync(state => new AppStateReducer(state).add(+1)),
    addRandomF: () =>
        async(getRandom(), (state, randomValue) => new AppStateReducer(state).add(randomValue)),
};

function sync(updater: (state: AppState) => AppState) {
    return { type: "sync" as const, fn: (state: AppState) => updater(state) };
}

function async<Value>(
    value$: Promise<Value>,
    updater: (state: AppState, value: Value) => AppState
) {
    const fn = () => value$.then(value => (state: AppState) => updater(state, value));
    return { type: "asyncPromise" as const, fn };
}

export function useAppState<SelectedState>(selector: Selector<AppState, SelectedState>) {
    return useAppContextWithActions(appContext, selector, appActions);
}

/* Generic */

function buildActions<State>() {
    return function <Actions>(getActions: (setState: SetState<State>) => Actions) {
        return getActions;
    };
}

export function useAppContextWithActions<State, SelectedState, Actions>(
    stateContext: StateContext<State>,
    selector: Selector<State, SelectedState>,
    getActions: (setState: SetState<State>) => Actions
) {
    const [value, setState] = useContextState(stateContext, selector);

    const actions = React.useMemo(() => {
        return getActions(setState); // Add any generic object commonly used in the actions
    }, [getActions, setState]);

    return [value, actions] as const;
}
