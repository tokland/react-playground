import React from "react";

import { AppState } from "../../domain/entities/AppState";
import { actions, dispatch, useAppState } from "./app/App";
import { getPathFromRoute, RouteSelector, route } from "../utils/router";

import CounterPage from "../pages/CounterPage";
import HomePage from "../pages/HomePage";

export const routes = {
    home: route("/home", {
        onEnter: () => actions.routes.goToHome(),
    }),

    counterForm: route("/counter/[id]", {
        onEnter: ({ args }) => actions.counter.goToCounter(args.id),
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

export function goTo<Selector extends RouteSelector<typeof routes>>(to: Selector) {
    const href = getPathFromRoute(routes, to);
    window.history.pushState({}, "", href);
    const route = routes[to.key];
    const action = route.onEnter({ args: (to.args || {}) as any, params: to.params || {} });
    dispatch(action);
}

export default React.memo(Router);
