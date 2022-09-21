import React from "react";
import {
    getPathFromRoute,
    runRouteOnEnterForPath,
    GenericRoutes,
    RouteSelector,
} from "../../utils/router";
import { Store } from "../../hooks/useStoreState";

interface UrlSyncProps<State> {
    routes: GenericRoutes;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
    store: Store<State>;
    routeFromState(state: State): RouteSelector<GenericRoutes>;
}

function UrlSync<State>(props: UrlSyncProps<State>) {
    const { routes, store, routeFromState, isReady, setIsReady } = props;
    const [state, setState] = React.useState(store.state);

    React.useEffect(() => store.subscribe(setState), [store]);

    // Set state from initial URL
    React.useEffect(() => {
        async function run() {
            await runRouteOnEnterForPath(routes, window.location);
            setIsReady(true);
        }

        if (!isReady) run();
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

export function useUrlSync<State>(
    store: Store<State>,
    routes: GenericRoutes,
    routeFromState: (state: State) => RouteSelector<GenericRoutes>
) {
    const [isReady, setIsReady] = React.useState(false);

    return { routes, isReady, setIsReady, store, routeFromState };
}

export default UrlSync;
