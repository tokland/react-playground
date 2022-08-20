import React from "react";
import HomePage from "./pages/HomePage";
import CounterPage from "./pages/CounterPage";
import { AppState } from "../domain/entities/AppState";
import { useAppStore } from "../domain/entities/AppStore";

export function getPage(path: string): AppState["page"] {
    const counterMatch = path.match(/^\/counter\/(?<id>\d+)/);

    if (path === "/") {
        return { type: "home" };
    } else if (counterMatch) {
        return { type: "counter", id: parseInt(counterMatch.groups?.id || "0") };
    } else {
        return <>No match</>;
    }
}

export function getPath(page: AppState["page"]): string {
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
        console.log("Initial", { path, page });
        actions.goTo(page);
    }, [actions]);

    if (page.type === "home") {
        return <HomePage />;
    } else if (page.type === "counter") {
        return <CounterPage id={page.id} />;
    } else {
        return <>No match</>;
    }
};

export default App;
