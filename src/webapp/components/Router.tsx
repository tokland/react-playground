import React from "react";
import { AppState } from "../../domain/entities/AppState";
import { route } from "../utils/router";
import CounterPage from "../pages/CounterPage";
import HomePage from "../pages/HomePage";
import { useAppState } from "../Store";

export const routes = {
    home: route("/", {
        onEnter: ({ actions }) => actions.routes.goToHome(),
    }),

    counterForm: route("/counter/[id]", {
        onEnter: ({ args, actions }) => actions.counter.loadCounterAndSetAsCurrentPage(args.id),
    }),
};

export function urlFromState(state: AppState): string {
    const { page } = state;

    switch (page.type) {
        case "home":
            return routes.home.build({});
        case "counter":
            return routes.counterForm.build({ id: page.id });
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
