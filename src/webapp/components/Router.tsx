import React from "react";

import { AppState } from "../../domain/entities/AppState";
import { useAppState } from "./app/App";
import { AppActions } from "../AppActions";
import { getRouteBuilder } from "../utils/router";

import CounterPage from "../pages/CounterPage";
import HomePage from "../pages/HomePage";

const route = getRouteBuilder<AppState, AppActions>();

export const routes = [
    route("/", {
        onEnter: ({ store }) => store.routes.goToHome(),
        fromState: state => state.page.type === "home",
    }),
    route("/counter/[id]", {
        params: ["x", "y"] as const,
        onEnter: ({ store, args, params: _params }) => {
            return store.routes.goToCounterPageAndLoad(args.id);
        },
        fromState: state => {
            if (state.page.type !== "counter") return false;

            switch (state.counter.type) {
                case "loading":
                case "loaded":
                    return `/counter/${state.counter.id}`;
                default:
                    return false;
            }
        },
    }),
];

const Router: React.FC = () => {
    const page = useAppState(state => state.page);

    switch (page.type) {
        case "home":
            return <HomePage />;
        case "counter":
            return <CounterPage />;
    }
};

export default React.memo(Router);