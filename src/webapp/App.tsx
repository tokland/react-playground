import React from "react";
import HomePage from "./pages/HomePage";
import CounterPage from "./pages/CounterPage";
import { Page } from "../domain/entities/AppState";
import { useAppStore } from "../domain/entities/AppStore";

export function getPage(path: string): Page {
    const counterMatch = path.match(/^\/counter\/(?<id>\d+)/);

    if (path === "/") {
        return { type: "home" };
    } else if (counterMatch) {
        return { type: "counter", id: parseInt(counterMatch.groups?.id || "1") };
    } else {
        throw new Error("getPage: no match");
    }
}

export function getPath(page: Page): string {
    switch (page.type) {
        case "home":
            return "/";
        case "counter":
            return `/counter/${page.id}`;
    }
}

const App: React.FC = () => {
    const [page, actions] = useAppStore(state => state.page);

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
            return <CounterPage id={page.id} />;
    }
};

export default App;
