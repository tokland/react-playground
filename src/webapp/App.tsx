import React from "react";
import HomePage from "./pages/HomePage";
import CounterPage from "./pages/CounterPage";
import { AppState, Page } from "../domain/entities/AppState";
import { useAppState, useAppSetState } from "./AppStateHooks";
import { getCompositionRoot } from "../compositionRoot";
import { AppContext, useAppContext } from "./AppContext";
import { AppStore } from "./AppStore";

declare const route: any;

// DEMO
() => {
    const _routes = [
        route("/", { toPage: () => ({ type: "home" }), fromPage: () => "/" }),
        route("/counter/:id", {
            toPage: ({ id }: any, _params: any) => ({ type: "counter", id }),
            fromPage: (page: Page) => `/counter/${page.type}`, // Page can be anything
        }),
    ];
};

async function runStoreActionFromPath(store: AppStore, path: string) {
    const counterMatch = path.match(/^\/counter\/(?<id>\d+)/);

    if (path === "/") {
        return store.routes.goToHome();
    } else if (counterMatch) {
        const id = counterMatch.groups?.id;
        if (!id) throw new Error();
        return store.routes.goToCounter(id);
    } else {
        throw new Error("getPage: no match");
    }
}

function getPathFromState(state: AppState): string {
    switch (state.page.type) {
        case "home":
            return "/";
        case "counter":
            return `/counter/1`;
    }
}

const App: React.FC = () => {
    const setState = useAppSetState();

    const appContext = React.useMemo(() => {
        const compositionRoot = getCompositionRoot();
        const store = new AppStore(compositionRoot, setState);
        return { compositionRoot, store };
    }, [setState]);

    const [isReady, setIsReady] = React.useState(false);

    return (
        <AppContext.Provider value={appContext}>
            <UrlSync isReady={isReady} setIsReady={setIsReady} />
            {isReady && <Router />}
        </AppContext.Provider>
    );
};

const UrlSync: React.FC<{
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isReady, setIsReady }) => {
    const { store } = useAppContext();
    const setState = useAppSetState();
    const state = useAppState(state => state);

    // Set initial state from URL
    React.useEffect(() => {
        async function run() {
            const path = window.location.pathname;
            await runStoreActionFromPath(store, path);
            setIsReady(true);
        }
        run();
    }, [store, setIsReady]);

    // Update URL from state changes
    React.useEffect(() => {
        if (!isReady) return;

        const currentPath = window.location.pathname;
        const pathFromState = getPathFromState(state);

        if (currentPath !== pathFromState) {
            window.history.pushState(state.page, "unused", pathFromState);
        }
    }, [state, isReady]);

    // Update state on popstate (back/forward button)
    React.useEffect(() => {
        window.addEventListener("popstate", ev => {
            setState(ev.state);
        });
    }, [setState]);

    return null;
};

const Router: React.FC = () => {
    const page = useAppState(state => state.page);

    switch (page.type) {
        case "home":
            return <HomePage />;
        case "counter":
            return <CounterPage />;
    }
};

export default App;
