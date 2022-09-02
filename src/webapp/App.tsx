import React from "react";
import HomePage from "./pages/HomePage";
import CounterPage from "./pages/CounterPage";
import { AppState } from "../domain/entities/AppState";
import { useAppState, useAppSetState } from "./AppStateHooks";
import { getCompositionRoot } from "../compositionRoot";
import { AppContext } from "./AppContext";
import { AppStore } from "./AppStore";
import { UrlSync, useUrlSync } from "./components/app/UrlSync";

const App: React.FC = () => {
    const setState = useAppSetState();

    const appContext = React.useMemo(() => {
        const compositionRoot = getCompositionRoot();
        const store = new AppStore(compositionRoot, setState);
        return { compositionRoot, store };
    }, [setState]);

    const urlSync = useUrlSync();

    return (
        <AppContext.Provider value={appContext}>
            <UrlSync store={appContext.store} {...urlSync} />
            {urlSync.isReady && <Router />}
        </AppContext.Provider>
    );
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

function getRouteBuilder<State, Store>() {
    return function route<Path extends string, Params extends readonly string[] = []>(
        path: Path,
        options: Omit<Route<State, Store, Path, Params>, "path">
    ): Route<State, Store, Path, Params> {
        return { path, ...options };
    };
}

interface Route<State, Store, Path extends string, Params extends readonly string[]> {
    path: Path;
    onEnter: (options: {
        store: Store;
        args: ExtractArgsFromPath<Path>;
        params: Partial<Record<Params[number], string>>;
    }) => void | Promise<void>;
    fromState: (state: State) => string | boolean;
    params?: Params;
}

type ExtractArgsFromPath<
    Path extends String,
    Output = {}
> = Path extends `${string}[${infer Var}]${infer S2}`
    ? ExtractArgsFromPath<S2, Output & Record<Var, string>>
    : { [K in keyof Output]: Output[K] };

const route = getRouteBuilder<AppState, AppStore>();

const routes = [
    route("/", {
        onEnter: ({ store }) => store.routes.goToHome(),
        fromState: state => state.page.type === "home",
    }),
    route("/counter/[id]", {
        params: ["x", "y"] as const,
        onEnter: ({ store, args, params }) => store.routes.loadCounterAndSetPage(args.id),
        fromState: state =>
            state.page.type === "counter" && state.counter ? `/counter/${state.counter.id}` : false,
    }),
];

export async function runStoreActionFromPath(store: AppStore, path: string) {
    (routes as Array<Route<any, any, any, any>>).forEach(route => {
        const re = route.path.replace(/\[(\w+)\]/, "(?<$1>[\\w-_]+)");
        const match = path.match(new RegExp(re));

        if (match) {
            const args = match.groups as ExtractArgsFromPath<typeof route.path>;
            route.onEnter({ store, args, params: {} });
        }
    });
}

export function getPathFromState(state: AppState): string {
    const routes2 = routes as Array<Route<any, any, any, any>>;

    for (const route of routes2) {
        const res = route.fromState(state);

        switch (res) {
            case true:
                return route.path;
            case false:
                continue;
            default:
                return res;
        }
    }

    return "/";
}

export default App;
