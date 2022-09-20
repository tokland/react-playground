import React from "react";

import { AppState } from "../../domain/entities/AppState";
import { actions, useAppState } from "./app/App";
import { AppActions } from "../AppActions";
import { getPathFromRoute, getRouteBuilder, MkSelector } from "../utils/router";

import CounterPage from "../pages/CounterPage";
import HomePage from "../pages/HomePage";

const route = getRouteBuilder<AppActions>();

export const routes = {
    home: route("/", {
        onEnter: ({ actions }) => actions.routes.goToHome(),
    }),

    counterForm: route("/counter/[id]", {
        onEnter: ({ actions, args }) => actions.routes.goToCounter(args.id),
    }),
};

export function routeFromState(state: AppState): MkSelector<typeof routes> {
    const { page } = state;

    switch (page.type) {
        case "home":
            return { key: "home" };
        case "counter":
            return { key: "counterForm", args: { id: page.id } };
    }
}

const Router: React.FC = () => {
    const page = useAppState(state => state.page);

    switch (page.type) {
        case "home":
            return <HomePage />;
        case "counter":
            return <CounterPage />;
    }
};

type Routes = typeof routes;

export function goTo<Selector extends MkSelector<Routes>>(to: Selector) {
    const href = getPathFromRoute(routes, to);
    window.history.pushState({}, "", href);
    const route = routes[to.key];
    route.onEnter({ actions, args: (to.args || {}) as any, params: to.params || {} });
}

export default React.memo(Router);
