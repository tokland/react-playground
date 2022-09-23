import React from "react";
import _ from "lodash";
import {
    getPathFromRoute,
    runRouteOnEnterForPath,
    GenericRoutes,
    RouteSelector,
} from "../../utils/router";
import { Store } from "../../hooks/useStoreState";

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

    React.useEffect(() => store.subscribe(setState), [store]);

    // Set state from initial URL
    React.useEffect(() => {
        async function run() {
            const res = runRouteOnEnterForPath(routes, window.location);
            return res ? res.run(() => setIsReady(true), _.noop) : setIsReady(true);
        }
        run();
    }, [routes, isReady, setIsReady, store]);

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
        const handler = () => runRouteOnEnterForPath(routes, window.location);
        window.addEventListener("popstate", handler);
        return () => window.removeEventListener("popstate", handler);
    }, [routes]);

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
