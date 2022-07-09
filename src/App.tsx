import React from "react";
import { AppState, initialAppState } from "./AppState";
import { Counter } from "./Counter";
import { createContextState, useContextStateProvider } from "./StateContext";

export const appContext = createContextState<AppState>();

const App = () => {
    const AppStateProvider = useContextStateProvider(appContext, initialAppState);

    return (
        <AppStateProvider>
            <Counter />
        </AppStateProvider>
    );
};
export default App;
