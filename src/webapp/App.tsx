import React from "react";
import HomePage from "./pages/HomePage";
import CounterPage from "./pages/CounterPage";
import { Page } from "../domain/entities/AppState";
import { useAppActions, useAppState } from "../domain/entities/AppStore";

declare const route: any;

() => {
    const _routes = [
        route("/", { toPage: () => ({ type: "home" }), fromPage: () => "/" }),
        route("/counter/:id", {
            toPage: ({ id }: any, _params: any) => ({ type: "counter", id }),
            fromPage: (page: Page) => `/counter/${page.type}`, // Page can be anything
        }),
    ];
};

export function getPage(path: string): Page {
    const counterMatch = path.match(/^\/counter\/(?<id>\d+)/);

    if (path === "/") {
        return { type: "home" };
    } else if (counterMatch) {
        const id = parseInt(counterMatch.groups?.id || "1");
        return { type: "counter", counter: { id: id, value: id } };
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

const App: React.FC = () => {
    const page = useAppState(state => state.page);
    const actions = useAppActions();

    React.useEffect(() => {
        window.addEventListener("popstate", ev => {
            const pageInState = ev.state;
            actions.goTo(pageInState);
        });
    }, [actions]);

    React.useEffect(() => {
        const path = window.location.pathname;
        const page = getPage(path);
        actions.goTo(page);
    }, [actions]);

    switch (page.type) {
        case "home":
            return <HomePage />;
        case "counter":
            return <CounterPage counter={page.counter} />;
    }
};

export default App;
