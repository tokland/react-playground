import React from "react";

import { AppState } from "../../domain/entities/AppState";
import { useAppState } from "../AppStateHooks";
import { AppStore } from "../AppStore";
import { getRouteBuilder } from "../utils/router";

import CounterPage from "./CounterPage";
import HomePage from "./HomePage";

const route = getRouteBuilder<AppState, AppStore>();

export const routes = [
    route("/", {
        onEnter: ({ store }) => store.routes.goToHome(),
        fromState: state => state.page.type === "home",
    }),
    route("/counter/[id]", {
        params: ["x", "y"] as const,
        onEnter: ({ store, args, params: _params }) =>
            store.routes.loadCounterAndGoToCounterPage(args.id),
        fromState: state =>
            state.page.type === "counter" && state.counter ? `/counter/${state.counter.id}` : false,
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
