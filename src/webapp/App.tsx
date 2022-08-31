import React from "react";
import HomePage from "./pages/HomePage";
import CounterPage from "./pages/CounterPage";
import { AppState } from "../domain/entities/AppState";
import { useAppState, useAppSetState } from "./AppStateHooks";
import { getCompositionRoot } from "../compositionRoot";
import { AppContext, useAppContext } from "./AppContext";
import { AppStore } from "./AppStore";

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

// DEMO
declare function route(path: string, options: Options): { path: string; options: Options };

interface Options {
    onEnter: (store: AppStore, args: any, params: object) => void | Promise<void>;
    fromState: (state: AppState) => string | undefined;
}

() => {
    const _routes = [
        route("/", {
            onEnter: (store: AppStore) => store.routes.goToHome(),
            fromState: (state: AppState) => (state.page.type === "home" ? `/` : undefined),
        }),
        route("/counter/:id", {
            onEnter: (store: AppStore, args, _params) =>
                store.routes.loadCounterAndSetPage(args.id),
            fromState: (state: AppState) =>
                state.page.type === "counter" && state.counter
                    ? `/counter/${state.counter.id}`
                    : undefined,
        }),
    ];
};

// DEMO2: no
() => {
    function _router(state: AppState) {
        switch (state.page.type) {
            case "home":
                return {
                    matchPath: "/",
                    generatePath: "/",
                    render: () => <HomePage />,
                };
            case "counter":
                return {
                    matchPath: `/counter/:id`,
                    generatePath: `/counter/${state.counter?.id || "1"}`,
                    render: () => <CounterPage />,
                };
        }
    }
};

async function runStoreActionFromPath(store: AppStore, path: string) {
    const counterMatch = path.match(/^\/counter\/(?<id>\d+)/);

    if (path === "/") {
        store.routes.goToHome();
    } else if (counterMatch) {
        const id = counterMatch.groups?.id || "1";
        store.routes.loadCounterAndSetPage(id);
    } else {
        throw new Error(`No route match: ${path}`);
    }
}

function getPathFromState(state: AppState): string {
    switch (state.page.type) {
        case "home":
            return "/";
        case "counter":
            return `/counter/${state.counter?.id || "1"}`;
    }
}

export default App;
