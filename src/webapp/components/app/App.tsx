import React from "react";
import { getCompositionRoot } from "../../../compositionRoot";
import { AppContext, AppContextState } from "./AppContext";
import { AppActions } from "../../AppActions";
import UrlSync, { useUrlSync } from "./UrlSync";
import Router, { routes } from "../Router";
import { AppState } from "../../../domain/entities/AppState";
import { getStoreHooks } from "../../StoreHooks";

const App: React.FC = () => {
    const urlSync = useUrlSync();

    const appContext = React.useMemo<AppContextState>(() => {
        const compositionRoot = getCompositionRoot();
        const actions = new AppActions({ compositionRoot, store: appStore });
        return { compositionRoot, actions };
    }, []);

    return (
        <AppContext.Provider value={appContext}>
            <UrlSync routes={routes} store={appContext.actions} {...urlSync} />
            {urlSync.isReady && <Router />}
        </AppContext.Provider>
    );
};

const initialAppState: AppState = {
    page: { type: "home" },
    session: { type: "loggedIn", username: "arnau" },
    counters: {},
};

const [appStore, useAppState] = getStoreHooks(initialAppState);

export { appStore, useAppState };

export default React.memo(App);
