import React from "react";
import {
    getPathFromRoute,
    runRouteOnEnterForPath,
    GenericRoutes,
    RouteSelector,
} from "../../utils/router";
import { useActions } from "../../AppActions";

interface UrlSyncProps<State, Routes extends GenericRoutes> {
    routes: Routes;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
    store: Store<State>;
    routeFromState(state: State): RouteSelector<Routes>;
}

function UrlSync<State, Routes extends GenericRoutes>(props: UrlSyncProps<State, Routes>) {
    const { routes, store, routeFromState, isReady, setIsReady } = props;
    const [state, setState] = React.useState(store.state);
    const actions = useActions();

    React.useEffect(() => store.subscribe(setState), [store]);

    // Set state from initial URL
    React.useEffect(() => {
        async function run() {
            runRouteOnEnterForPath(routes, window.location, actions);
            setIsReady(true);
        }
        if (!isReady) run();
    }, [actions, routes, isReady, setIsReady, store]);

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
    store: Store<State>,
    routes: Routes,
    routeFromState: (state: State) => RouteSelector<Routes>
) {
    const [isReady, setIsReady] = React.useState(false);

    return { routes, isReady, setIsReady, store, routeFromState };
}

export default UrlSync;
