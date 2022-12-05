import React, { useContext } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { AppState } from "../domain/entities/AppState";
import { AppActions } from "./AppActions";

export type Store<State> = { get(): State; set(state: State): void };
type ZustandStore<State, Actions> = StoreApi<{ state: State; actions: Actions }>;

export function buildStore<State>() {
    const Actions = AppActions;
    type Actions = AppActions;

    const StoreContextValue = React.createContext<ZustandStore<State, Actions> | null>(null);

    function useZustandStore() {
        const zstore = useContext(StoreContextValue);
        if (!zstore) throw new Error();
        return zstore;
    }

    const StoreContext = StoreContextValue.Provider;

    function useAppState<SelectedState>(selector: (state: State) => SelectedState) {
        const zstore = useZustandStore();
        return useStore(zstore, obj => selector(obj.state));
    }

    function useActions(): Actions {
        const zstore = useZustandStore();
        return useStore(zstore, obj => obj.actions);
    }

    return { StoreContext, getContextValue, useAppState, useActions };
}

type Builder<State, Actions> = (store: Store<State>) => { initialState: State; actions: Actions };

function getContextValue<State, Actions>(
    builder: Builder<State, Actions>
): ZustandStore<State, Actions> {
    return createStore<{ state: State; actions: Actions }>((set, get) => {
        const store: Store<State> = { set: state => set({ state }), get: () => get().state };
        const { initialState, actions } = builder(store);
        return { state: initialState, actions };
    });
}

function useStoreContext<State, Actions>(builder: Builder<State, Actions>) {
    const builderRef = React.useRef(builder);
    return getContextValue(builderRef.current);
}

export { useStoreContext };

const { StoreContext, useAppState, useActions } = buildStore<AppState>();
export { StoreContext, useAppState, useActions };
