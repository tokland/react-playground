import _ from "lodash";
import { Selector, Store, useStoreDispatch, useStoreState } from "./StoreState";

export function getStoreHooks<State>(initialState: State) {
    const store = new Store(initialState);

    function useState<SelectedState>(selector: Selector<State, SelectedState>) {
        return useStoreState(store, selector);
    }

    function useDispatch() {
        return useStoreDispatch(store);
    }

    return { useState, useDispatch };
}
