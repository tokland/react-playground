import React from "react";

import { AppState } from "../../domain/entities/AppState";
import { useAppState } from "./app/App";
import { AppActions } from "../AppActions";
import { getRouteBuilder, MkSelector } from "../utils/router";

import CounterPage from "../pages/CounterPage";
import HomePage from "../pages/HomePage";

const route = getRouteBuilder<AppState, AppActions>();

export const routes = {
    home: route("/", {
        params: ["x"] as const,
        onEnter: ({ actions }) => actions.routes.goToHome(),
    }),

    counterForm: route("/counter/[id]", {
        onEnter: ({ actions, args }) => actions.routes.goToCounter(args.id),
    }),
};

type T1 = Extract<MkSelector<typeof routes>, { key: "home" }>["params"];

export function routeFromState(state: AppState): MkSelector<typeof routes> {
    const { page } = state;

    switch (page.type) {
        case "home":
            return { key: "home", params: { y: "1" } };
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

export default React.memo(Router);
