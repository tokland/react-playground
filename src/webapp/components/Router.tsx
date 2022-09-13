import React from "react";

import { AppState } from "../../domain/entities/AppState";
import { useAppState } from "./app/App";
import { AppActions } from "../AppActions";
import { getRouteBuilder } from "../utils/router";

import CounterPage from "../pages/CounterPage";
import HomePage from "../pages/HomePage";

const route = getRouteBuilder<AppState, AppActions>();

export const routes = {
    home: route("/", {
        onEnter: ({ actions }) => actions.routes.goToHome(),
    }),

    counterForm: route("/counter/[id]", {
        onEnter: ({ actions, args }) => actions.routes.goToCounter(args.id),
    }),
};

export function routeFromState(state: AppState): string {
    const { page } = state;

    switch (page.type) {
        case "home":
            return "/";
        case "counter":
            return `/counter/${page.id}`;
    }
}

// function getFns<typeof routes>() =>
//   routeFromState(state: State): { key, args, params }
//   componentFromState ?

/*
export const routes = [
    route("/", {
        onEnter: ({ actions: store }) => store.routes.goToHome(),
        fromState: state => state.page.type === "home",
    }),
    route("/counter/[id]", {
        onEnter: ({ actions: store, args }) => {
            return store.routes.goToCounter(args.id);
        },
        fromState: state => {
            if (state.page.type === "counter") {
                return `/counter/${state.page.id}`;
            } else {
                return false;
            }
        },
    }),
];
*/

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
