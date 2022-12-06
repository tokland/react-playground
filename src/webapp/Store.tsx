import React, { useContext } from "react";
import { createStore, StoreApi, useStore as useStoreZustand } from "zustand";
import { AppState } from "../domain/entities/AppState";
import { AppActions } from "./AppActions";

export interface Store<State> {
    get(): State;
    set(state: State): void;
}

export function buildStore<State, Actions>() {
    const StoreProviderValue = React.createContext<ZustandStore | null>(null);
    type ZustandStore = StoreApi<{ state: State; actions: Actions }>;

    function useCompositeStore() {
        const zstore = useContext(StoreProviderValue);
        if (!zstore) throw new Error();
        return zstore;
    }

    function useStoreState<SelectedState>(selector: (state: State) => SelectedState) {
        const zstore = useCompositeStore();
        return useStoreZustand(zstore, obj => selector(obj.state));
    }

    function useStoreActions(): Actions {
        const zstore = useCompositeStore();
        return useStoreZustand(zstore, obj => obj.actions);
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

    function useStore(builder: Builder) {
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

    return {
        useStore,
        useStoreState,
        useStoreActions,
    };
}

const {
    useStore: useAppStore,
    useStoreState: useAppState,
    useStoreActions: useAppActions,
} = buildStore<AppState, AppActions>();

export { useAppStore, useAppState, useAppActions };
