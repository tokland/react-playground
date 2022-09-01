import React from "react";
import HomePage from "./pages/HomePage";
import CounterPage from "./pages/CounterPage";
import { AppState } from "../domain/entities/AppState";
import { useAppState, useAppSetState } from "./AppStateHooks";
import { getCompositionRoot } from "../compositionRoot";
import { AppContext } from "./AppContext";
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
            <UrlSync store={appContext.store} isReady={isReady} setIsReady={setIsReady} />
            {isReady && <Router />}
        </AppContext.Provider>
    );
};

interface UrlSyncProps {
    store: AppStore;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
}

const UrlSync: React.FC<UrlSyncProps> = props => {
    const { store, isReady, setIsReady } = props;
    const state = useAppState(state => state);

    // Set state from initial URL
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
        const currentPath = window.location.pathname;
        const pathFromState = getPathFromState(state);

        if (isReady && currentPath !== pathFromState) {
            window.history.pushState(state, "unused", pathFromState);
        }
    }, [state, isReady]);

    // Update state on Back/Forward browser actions
    React.useEffect(() => {
        window.addEventListener("popstate", () => {
            const currentPath = window.location.pathname;
            runStoreActionFromPath(store, currentPath);
        });
    }, [store]);

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

function route<Path extends string, Params extends readonly string[]>(
    path: Path,
    options: Options<Path, Params>
): { path: Path; options: Options<Path, Params> } {
    return { path, options };
}

interface Options<Path extends string, Params extends readonly string[]> {
    onEnter: (
        store: AppStore,
        args: ExtractArgsFromPath<Path, {}>,
        params: Partial<Record<Params[number], string>>
    ) => void | Promise<void>;
    fromState: (state: AppState) => string | boolean;
    params?: Params;
}

type ExtractArgsFromPath<
    Path extends String,
    Output
> = Path extends `${string}[${infer Var}]${infer S2}`
    ? ExtractArgsFromPath<S2, Output & Record<Var, string>>
    : { [K in keyof Output]: Output[K] };

() => {
    const _routes = [
        route("/", {
            onEnter: (store: AppStore) => store.routes.goToHome(),
            fromState: (state: AppState) => state.page.type === "home",
        }),
        route("/counter/[id]", {
            params: ["x", "y"] as const,
            onEnter: (store: AppStore, args, _params) =>
                store.routes.loadCounterAndSetPage(args.id),
            fromState: (state: AppState) =>
                state.page.type === "counter" && state.counter
                    ? `/counter/${state.counter.id}`
                    : false,
        }),
    ] as const;
};

async function runStoreActionFromPath(store: AppStore, path: string) {
    let match: RegExpMatchArray | null;

    if (path === "/") {
        store.routes.goToHome();
    } else if ((match = path.match(/^\/counter\/(?<id>\d+)/))) {
        const id = match.groups?.id || "";
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
