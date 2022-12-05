import React, { useContext } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { AppState } from "../domain/entities/AppState";
import { AppActions } from "./AppActions";

export type Store<State> = { get(): State; set(state: State): void };

export function buildStore<State>() {
    const Actions = AppActions;
    type Actions = AppActions;

    const StoreProviderValue = React.createContext<ZustandStore | null>(null);
    type ZustandStore = StoreApi<{ state: State; actions: Actions }>;

    function useZustandStore() {
        const zstore = useContext(StoreProviderValue);
        if (!zstore) throw new Error();
        return zstore;
    }

    function useAppState<SelectedState>(selector: (state: State) => SelectedState) {
        const zstore = useZustandStore();
        return useStore(zstore, obj => selector(obj.state));
    }

    function useActions(): Actions {
        const zstore = useZustandStore();
        return useStore(zstore, obj => obj.actions);
    }

    type Builder = (store: Store<State>) => {
        initialState: State;
        actions: Actions;
    };

    function getContextValue(builder: Builder): ZustandStore {
        return createStore<{ state: State; actions: Actions }>((set, get) => {
            const store: Store<State> = { set: state => set({ state }), get: () => get().state };
            const { initialState, actions } = builder(store);
            return { state: initialState, actions };
        });
    }

    function useAppStore(builder: Builder) {
        const builderRef = React.useRef(builder);
        const value = React.useMemo(() => getContextValue(builderRef.current), []);

        const StoreProvider = React.useCallback<React.FC>(
            ({ children }) => {
                return (
                    <StoreProviderValue.Provider value={value}>
                        {children}
                    </StoreProviderValue.Provider>
                );
            },
            [value]
        );

        return StoreProvider;
    }

    return { useAppStore, useAppState, useActions };
}

const { useAppStore, useAppState, useActions } = buildStore<AppState>();
export { useAppStore, useAppState, useActions };
