import React from "react";
import { useContext } from "react";
import { CompositionRoot } from "../compositionRoot";

interface AppContextState {
    compositionRoot: CompositionRoot;
}

export const AppContext = React.createContext<AppContextState | null>(null);

export function useAppContext() {
    const appContext = useContext(AppContext);
    if (!appContext) throw new Error("Context not defined");
    return appContext;
}
