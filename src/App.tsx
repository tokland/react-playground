import React from "react";
import { AppState, initialAppState } from "./AppReducer";
import { Counter } from "./Counter";
import { createStateContext, useStateProvider } from "./StateContext";

export const appContext = createStateContext<AppState>();

const App = () => {
    const AppStateProvider = useStateProvider(appContext, initialAppState);

    return (
        <AppStateProvider>
            <Counter counterId="counter1" />
            <Counter counterId="counter2" />
        </AppStateProvider>
    );
};

export default App;
