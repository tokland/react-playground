import React from "react";

import { AppState } from "../../domain/entities/AppState";
import { actions, useAppState } from "./app/App";
import { getPathFromRoute, MkSelector, route } from "../utils/router";

import CounterPage from "../pages/CounterPage";
import HomePage from "../pages/HomePage";

export const routes = {
    home: route("/home", {
        onEnter: () => actions.routes.goToHome(),
    }),

    counterForm: route("/counter/[id]", {
        onEnter: ({ args }) => actions.routes.goToCounter(args.id),
    }),
};

/*
export type GetActions<Routes extends GenericRoutes> = Routes[keyof Routes] extends TypedRoute<
    infer Actions,
    any,
    any
>
    ? Actions
    : never;
*/

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

export function goTo<Selector extends MkSelector<typeof routes>>(to: Selector) {
    const href = getPathFromRoute(routes, to);
    window.history.pushState({}, "", href);
    const route = routes[to.key];
    route.onEnter({ args: (to.args || {}) as any, params: to.params || {} });
}

export default React.memo(Router);
