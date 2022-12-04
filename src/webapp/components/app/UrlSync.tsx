import React from "react";
import {
    getPathFromRoute,
    runRouteOnEnterForPath,
    GenericRoutes,
    RouteSelector,
} from "../../utils/router";
import { useActions, useAppState } from "../../Store";
import { AppState } from "../../../domain/entities/AppState";

type State = AppState;

interface UrlSyncProps<Routes extends GenericRoutes> {
    routes: Routes;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
    routeFromState(state: State): RouteSelector<Routes>;
}

function UrlSync<Routes extends GenericRoutes>(props: UrlSyncProps<Routes>) {
    const { routes, routeFromState, isReady, setIsReady } = props;
    const state = useAppState(state => state);
    const actions = useActions();

    // Set state from initial URL
    React.useEffect(() => {
        async function run() {
            runRouteOnEnterForPath(routes, window.location, actions);
            setIsReady(true);
        }
        if (!isReady) run();
    }, [actions, routes, isReady, setIsReady]);

    // Update URL from state changes
    React.useEffect(() => {
        const currentPath = window.location.pathname;
        const pathFromState = getPathFromRoute(routes, routeFromState(state));

        if (isReady && currentPath !== pathFromState) {
            window.history.pushState(null, "unused", pathFromState);
        }
    }, [state, routes, isReady, routeFromState]);

    // Update state on popstate (browser back/forward)
    React.useEffect(() => {
        const handler = () => {
            runRouteOnEnterForPath(routes, window.location, actions);
        };
        window.addEventListener("popstate", handler);
        return () => window.removeEventListener("popstate", handler);
    }, [routes, actions]);

    return null;
}

export function useUrlSync<State, Routes extends GenericRoutes>(
    routes: Routes,
    routeFromState: (state: State) => RouteSelector<Routes>
) {
    const [isReady, setIsReady] = React.useState(false);

    return { routes, isReady, setIsReady, routeFromState };
}

export default UrlSync;
