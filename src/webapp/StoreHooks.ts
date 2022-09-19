import { Selector, Store, useStoreState } from "./hooks/useStoreState";

export function getStoreHooks<State, Actions>(
    initialState: State,
    getActions: (store: Store<State>) => Actions
) {
    const store = new Store(initialState);

    function useState<SelectedState>(selector: Selector<State, SelectedState>) {
        return useStoreState(store, selector);
    }

    const actions = getActions(store);

    return [useState, actions] as const;
}
