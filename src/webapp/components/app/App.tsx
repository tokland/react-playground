import React from "react";
import { getCompositionRoot } from "../../../compositionRoot";
import { AppContext, AppContextState } from "./AppContext";
import { AppActions } from "../../AppActions";
import UrlSync, { useUrlSync } from "./UrlSync";
import Router, { routes } from "../Router";
import { AppState } from "../../../domain/entities/AppState";
import { getStoreHooks } from "../../StoreHooks";
import { Selector } from "../../hooks/useStoreState";
import "./App.css";

const initialAppState = new AppState({
    page: { type: "home" },
    //session: { type: "unauthenticated" },
    session: { type: "loggedIn", username: "test" },
    counters: {},
});

const [appStore, useAppState] = getStoreHooks<AppState>(initialAppState);

const App: React.FC = () => {
    const urlSync = useUrlSync();

    const appContext = React.useMemo<AppContextState>(() => {
        const compositionRoot = getCompositionRoot();
        const actions = new AppActions({ compositionRoot, store: appStore });
        return { compositionRoot, actions };
    }, []);

    return (
        <AppContext.Provider value={appContext}>
            <UrlSync routes={routes} actions={appContext.actions} {...urlSync} />
            {urlSync.isReady && <Router />}
        </AppContext.Provider>
    );
};

export function useAppStateOrFail<SelectedState>(
    selector: Selector<AppState, SelectedState | undefined>
): SelectedState {
    const value = useAppState(selector);
    if (value === undefined) throw new Error("Cannot get value");
    return value;
}

export { useAppState };

export default React.memo(App);
