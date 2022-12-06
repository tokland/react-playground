import React from "react";

import { AppState } from "../../domain/entities/AppState";
import { getPathFromRoute, RouteSelector, route } from "../utils/router";

import CounterPage from "../pages/CounterPage";
import HomePage from "../pages/HomePage";
import { useAppActions, useAppState } from "../Store";

export const routes = {
    home: route("/home", {
        onEnter: ({ actions }) => actions.routes.goToHome(),
    }),

    counterForm: route("/counter/[id]", {
        onEnter: ({ args, actions }) => actions.counter.loadCounterAndSetAsCurrentPage(args.id),
    }),
};

export type AppRoute = RouteSelector<typeof routes>;

export function routeFromState(state: AppState): RouteSelector<typeof routes> {
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

export function useGoTo() {
    const actions = useAppActions();

    const goTo = React.useCallback(
        function <Selector extends RouteSelector<typeof routes>>(to: Selector) {
            const href = getPathFromRoute(routes, to);
            window.history.pushState({}, "", href);
            const route = routes[to.key];
            route.onEnter({ actions, args: (to.args || {}) as any, params: to.params || {} });
        },
        [actions]
    );

    return goTo;
}

export default React.memo(Router);
