import React from "react";
import { AppStateReducer, AppState, initialAppState } from "./AppState";
import { getStore, Selector, SetState } from "./StoreState";

const appActions = buildActions<AppState>()(update => ({
    decrement: () => update(state => new AppStateReducer(state).addCounter(-1)),
    increment: () => update(state => new AppStateReducer(state).addCounter(+1)),
    addRandom: () =>
        getRandomInteger({ min: 1, max: 5 })
            .then(value => update(state => new AppStateReducer(state).addCounter(value)))
            .catch(console.error),
}));

async function getRandomInteger(options: { min: number; max: number }): Promise<number> {
    const { min, max } = options;
    const value = Math.floor(Math.random() * (max - min) + min);

    return new Promise(resolve => {
        window.setTimeout(() => resolve(value), 1e3);
    });
}

const useAppStoreWithSetState = getStore(initialAppState);

export function useAppStore<SelectedState>(selector: Selector<AppState, SelectedState>) {
    const [selectedState, setState] = useAppStoreWithSetState(selector);

    const actions = React.useMemo(() => {
        return appActions(setState); // Add other objects useful for the actions reducer
    }, [setState]);

    return [selectedState, actions] as const;
}

function buildActions<State>() {
    return function <Actions>(getActions: (setState: SetState<State>) => Actions) {
        return getActions;
    };
}
