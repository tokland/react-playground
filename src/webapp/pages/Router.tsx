import React from "react";

import { AppState } from "../../domain/entities/AppState";
import { useAppState } from "../App";
import { AppActions } from "../AppActions";
import { getRouteBuilder } from "../utils/router";

import CounterPage from "./CounterPage";
import HomePage from "./HomePage";

const route = getRouteBuilder<AppState, AppActions>();

export const routes = [
    route("/", {
        onEnter: ({ store }) => store.routes.goToHome(),
        fromState: state => state.page.type === "home",
    }),
    route("/counter/[id]", {
        params: ["x", "y"] as const,
        onEnter: ({ store, args, params: _params }) => store.routes.loadCounterAndGoToPage(args.id),
        fromState: state => (state.page.type === "counter" ? `/counter/${state.page.id}` : false),
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
