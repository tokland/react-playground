import { Selector, Store, useStoreSetState, useStoreState } from "./StoreState";

export function getStoreHooks<State>(initialState: State) {
    const store = new Store(initialState);

    function useState<SelectedState>(selector: Selector<State, SelectedState>) {
        return useStoreState(store, selector);
    }

    function useSetState() {
        return useStoreSetState(store);
    }

    return [store, useState, useSetState] as const;
}
