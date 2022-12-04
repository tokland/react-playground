import React, { useContext } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { CompositionRoot } from "../compositionRoot";
import { AppState } from "../domain/entities/AppState";
import { AppActions } from "./AppActions";

const Actions = AppActions;
type State = AppState;
type Actions = AppActions;
type ZustandStore = StoreApi<{ state: State; actions: Actions }>;

const StoreContext = React.createContext<ZustandStore | null>(null);

function useZustandStore() {
    const zstore = useContext(StoreContext);
    if (!zstore) throw new Error();
    return zstore;
}

export type Store = { get(): State; set(state: State): void };

export function getStore(compositionRoot: CompositionRoot, initialState: State) {
    return createStore<{ state: State; actions: Actions }>((set, get) => ({
        state: initialState,
        actions: new AppActions({
            compositionRoot,
            store: { set: state => set({ state }), get: () => get().state },
        }),
    }));
}

export const StoreWrapper = StoreContext.Provider;

export function useAppState<SelectedState>(selector: (state: State) => SelectedState) {
    const zstore = useZustandStore();
    return useStore(zstore, obj => selector(obj.state));
}

export function useActions(): Actions {
    const zstore = useZustandStore();
    return useStore(zstore, obj => obj.actions);
}
