import React from "react";
import { useAppSetState } from "./AppStateHooks";
import { getCompositionRoot } from "../compositionRoot";
import { AppContext } from "./AppContext";
import { AppStore } from "./AppStore";
import { useUrlSync } from "./hooks/useUrlSync";
import { Router, routes } from "./pages/Router";

const App: React.FC = () => {
    const setState = useAppSetState();

    const appContext = React.useMemo(() => {
        const compositionRoot = getCompositionRoot();
        const store = new AppStore(compositionRoot, setState);
        return { compositionRoot, store };
    }, [setState]);

    const urlSync = useUrlSync(routes, appContext.store);

    return (
        <AppContext.Provider value={appContext}>
            {urlSync.isReady && <Router />}
        </AppContext.Provider>
    );
};

export default App;
