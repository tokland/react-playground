import React from "react";
import HomePage from "./pages/HomePage";
import CounterPage from "./pages/CounterPage";
import { AppState } from "../domain/entities/AppState";
import { useAppStore } from "../domain/entities/AppStore";

export function getPage(path: string): AppState["page"] {
    if (path === "/") {
        return { type: "home" };
    } else if (path.match(/^\/counter\/\d+/)) {
        return { type: "counter", id: 1 };
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
        const page = getPage(window.location.pathname);
        actions.goTo(page);
    }, [actions]);

    if (page.type === "home") {
        return <HomePage />;
    } else if (page.type === "counter") {
        return <CounterPage />;
    } else {
        return <>No match</>;
    }
};

export default App;
