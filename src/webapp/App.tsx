import React from "react";
import { useAppSetState } from "./AppStateHooks";
import { getCompositionRoot } from "../compositionRoot";
import { AppContext } from "./AppContext";
import { AppStore } from "./AppStore";
import UrlSync, { useUrlSync } from "./components/app/UrlSync";
import Router, { routes } from "./pages/Router";

const App: React.FC = () => {
    const setState = useAppSetState();
    const urlSync = useUrlSync();

    const appContext = React.useMemo(() => {
        const compositionRoot = getCompositionRoot();
        const store = new AppStore(compositionRoot, setState);
        return { compositionRoot, store };
    }, [setState]);

    return (
        <AppContext.Provider value={appContext}>
            <UrlSync routes={routes} store={appContext.store} {...urlSync} />
            {urlSync.isReady && <Router />}
        </AppContext.Provider>
    );
};

export default React.memo(App);
