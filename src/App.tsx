import React from "react";
import { AppState, initialAppState } from "./AppReducer";
import { Counter } from "./Counter";
import { createContextState, useContextStateProvider } from "./StateContext";

export const appContext = createContextState<AppState>();

const App = () => {
    const AppStateProvider = useContextStateProvider(appContext, initialAppState);

    return (
        <AppStateProvider>
            <Counter counterId="counter1" />
            <Counter counterId="counter2" />
        </AppStateProvider>
    );
};

export default App;
