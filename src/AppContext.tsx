import React from "react";
import { AppStateReducer, AppState, getRandom, initialAppState } from "./AppState";
import { buildActions, buildStateHook, Selector } from "./StateContext";

export const useAppStateWithSetter = buildStateHook(initialAppState);

const appActions = buildActions<AppState>()(setState => ({
    decrement: () => setState(state => new AppStateReducer(state).add(-1)),
    increment: () => setState(state => new AppStateReducer(state).add(+1)),
    addRandom: async () => {
        const randomValue = await getRandom();
        setState(state => new AppStateReducer(state).add(randomValue));
    },
}));

export function useAppState<SelectedState>(selector: Selector<AppState, SelectedState>) {
    const [selectedState, setState] = useAppStateWithSetter(selector);

    const actions = React.useMemo(() => {
        return appActions(setState); // Add any global object useful for the actions reducer
    }, [setState]);

    return [selectedState, actions] as const;
}

/* 
const _appActionsFunctional = {
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
*/
