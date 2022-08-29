import React from "react";
import HomePage from "./pages/HomePage";
import CounterPage from "./pages/CounterPage";
import { AppState, Page } from "../domain/entities/AppState";
import { appReducer, useAppState, useAppDispatch } from "../domain/entities/AppReducer";
import { CompositionRoot, getCompositionRoot } from "../compositionRoot";
import { AppContext, useAppContext } from "./AppContext";
import { Session } from "./Session";
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

async function getPage(store: AppStore, path: string) {
    const counterMatch = path.match(/^\/counter\/(?<id>\d+)/);

    if (path === "/") {
        return store.goToHome();
    } else if (counterMatch) {
        const id = counterMatch.groups?.id;
        if (!id) throw new Error();
        return store.goToCounter(id);
    } else {
        throw new Error("getPage: no match");
    }
}

export function getPathFromState(state: AppState): string {
    switch (state.page.type) {
        case "home":
            return "/";
        case "counter":
            return `/counter/1`;
    }
}

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    const appContext = React.useMemo(() => {
        const compositionRoot = getCompositionRoot();
        const store = new AppStore(compositionRoot, dispatch);
        return { compositionRoot, store };
    }, [dispatch]);

    return (
        <AppContext.Provider value={appContext}>
            <Url />
            <Session />
            <Router />
        </AppContext.Provider>
    );
};

const Url: React.FC = () => {
    const { store } = useAppContext();
    const dispatch = useAppDispatch();
    const state = useAppState(state => state);
    const { page } = state;
    const listenToChangesRef = React.useRef(false);

    // useUrlToStateOnInit
    React.useEffect(() => {
        async function run() {
            const path = window.location.pathname;
            await getPage(store, path);
            listenToChangesRef.current = true;
        }
        run();
    }, [dispatch, store]);

    // useSyncFromStateToUrl
    React.useEffect(() => {
        if (!listenToChangesRef.current) return;

        const currentPath = window.location.pathname;
        const pathFromState = getPathFromState(state);

        if (currentPath !== pathFromState) {
            window.history.pushState(page, "unused", pathFromState);
        }
    }, [state, page]);

    // useUrlToStateSync
    React.useEffect(() => {
        window.addEventListener("popstate", ev => {
            const pageInState = ev.state;
            dispatch(appReducer.setPage(pageInState));
        });
    }, [dispatch]);

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
