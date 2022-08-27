import React from "react";
import HomePage from "./pages/HomePage";
import CounterPage from "./pages/CounterPage";
import { Page } from "../domain/entities/AppState";
import { appReducer, useAppState, userAppDispatch } from "../domain/entities/AppReducer";
import { CompositionRoot, getCompositionRoot } from "../compositionRoot";
import { AppContext, useAppContext } from "./AppContext";
import { Session } from "./Session";

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

async function getPage(compositionRoot: CompositionRoot, path: string): Promise<Page> {
    const counterMatch = path.match(/^\/counter\/(?<id>\d+)/);

    if (path === "/") {
        return { type: "home" };
    } else if (counterMatch) {
        const id = counterMatch.groups?.id;
        if (!id) throw new Error();
        const counter = await compositionRoot.counters.get(id);
        return { type: "counter", counter };
    } else {
        throw new Error("getPage: no match");
    }
}

// TODO?:       getPath(state: AppState): string
export function getPath(page: Page): string {
    switch (page.type) {
        case "home":
            return "/";
        case "counter":
            return `/counter/${page.counter.id}`;
    }
}

const appContext = { compositionRoot: getCompositionRoot() };

const App: React.FC = () => {
    return (
        <AppContext.Provider value={appContext}>
            <Url />
            <Session />
            <Router />
        </AppContext.Provider>
    );
};

const Url: React.FC = () => {
    const page = useAppState(state => state.page);

    React.useEffect(() => {
        const path = getPath(page);
        window.history.pushState(page, "unused", path);
    }, [page]);

    return null;
};

const Router: React.FC = () => {
    const page = useAppState(state => state.page);
    const dispatch = userAppDispatch();
    const { compositionRoot } = useAppContext();

    // useUrlToStateSync
    React.useEffect(() => {
        window.addEventListener("popstate", ev => {
            const pageInState = ev.state;
            console.log({ pageInState });
            dispatch(appReducer.goTo(pageInState));
        });
    }, [dispatch]);

    // useUrlToStateOnInit
    React.useEffect(() => {
        async function run() {
            const path = window.location.pathname;
            const page = await getPage(compositionRoot, path);
            dispatch(appReducer.goTo(page));
        }
        run();
    }, [dispatch, compositionRoot]);

    switch (page.type) {
        case "home":
            return <HomePage />;
        case "counter":
            return <CounterPage />;
    }
};

export default App;
