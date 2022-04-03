import React, { useContext } from "react";

export interface CounterState {
    value: number;
}

export interface AppState {
    counter1: CounterState;
    counter2: CounterState;
}

export interface AppStateContext {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const AppStateContextValue = React.createContext<AppStateContext | undefined>(undefined);

export function useAppState() {
    const state = useContext(AppStateContextValue);
    if (!state) throw new Error();
    return state;
}

export const AppStateProvider = AppStateContextValue.Provider;

export function useAppStateProvider(initialAppState: AppState): AppStateContext {
    const [state, setState] = React.useState(initialAppState);
    return { state, setState };
}
