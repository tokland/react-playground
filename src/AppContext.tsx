import React from "react";
import { AppStateReducer, AppState, initialAppState } from "./AppState";
import { buildActions, getStore, Selector } from "./StateContext";

export const useAppStoreWithSetState = getStore(initialAppState);

const appActions = buildActions<AppState>()(setState => ({
    decrement: () => setState(state => new AppStateReducer(state).add(-1)),
    increment: () => setState(state => new AppStateReducer(state).add(+1)),
    addRandom: async () => {
        const randomValue = await getRandom();
        setState(state => new AppStateReducer(state).add(randomValue));
    },
}));

async function getRandom(options: { min?: number; max?: number } = {}): Promise<number> {
    const { min = 1, max = 10 } = options;
    const value = Math.floor(Math.random() * (max - min) + min);

    return new Promise(resolve => {
        window.setTimeout(() => resolve(value), 1e3);
    });
}

export function useAppStore<SelectedState>(selector: Selector<AppState, SelectedState>) {
    const [selectedState, setState] = useAppStoreWithSetState(selector);

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
