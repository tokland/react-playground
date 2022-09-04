import React from "react";
import { appStore } from "./AppStateHooks";
import { getCompositionRoot } from "../compositionRoot";
import { AppContext, AppContextState } from "./AppContext";
import { AppActions } from "./AppActions";
import UrlSync, { useUrlSync } from "./components/app/UrlSync";
import Router, { routes } from "./pages/Router";

const App: React.FC = () => {
    const urlSync = useUrlSync();

    const appContext = React.useMemo<AppContextState>(() => {
        const compositionRoot = getCompositionRoot();
        const actions = new AppActions(compositionRoot, appStore);
        return { compositionRoot, actions };
    }, []);

    return (
        <AppContext.Provider value={appContext}>
            <UrlSync routes={routes} store={appContext.actions} {...urlSync} />
            {urlSync.isReady && <Router />}
        </AppContext.Provider>
    );
};

export default React.memo(App);
