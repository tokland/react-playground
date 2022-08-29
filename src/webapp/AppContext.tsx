import React from "react";
import { useContext } from "react";
import { CompositionRoot } from "../compositionRoot";
import { AppStore } from "./AppStore";

interface AppContextState {
    compositionRoot: CompositionRoot;
    store: AppStore;
}

export const AppContext = React.createContext<AppContextState | null>(null);

export function useAppContext() {
    const appContext = useContext(AppContext);
    if (!appContext) throw new Error("Context not defined");
    return appContext;
}
