import React from "react";
import { getPathFromRoute, runRouteOnEnterForPath, Routes, MkSelector } from "../../utils/router";
import { Store } from "../../hooks/useStoreState";

interface UrlSyncProps<State, Actions> {
    actions: Actions;
    routes: Routes;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
    store: Store<State>;
    routeFromState(state: State): MkSelector<Routes>;
}

function UrlSync<State, Actions>(props: UrlSyncProps<State, Actions>) {
    const { actions, routes, store, routeFromState, isReady, setIsReady } = props;
    const [state, setState] = React.useState(store.state);

    React.useEffect(() => store.subscribe(setState), [store]);

    // Set state from initial URL
    React.useEffect(() => {
        async function run() {
            await runRouteOnEnterForPath(routes, actions, window.location);
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

    // Update state on popstate (back/forward) browser actions
    React.useEffect(() => {
        const handler = () => runRouteOnEnterForPath(routes, actions, window.location);
        window.addEventListener("popstate", handler);
        return () => window.removeEventListener("popstate", handler);
    }, [actions, routes]);

    return null;
}

export function useUrlSync<State, Actions>(
    store: Store<State>,
    routes: Routes,
    actions: Actions,
    routeFromState: (state: State) => MkSelector<Routes>
) {
    const [isReady, setIsReady] = React.useState(false);

    return { routes, actions, isReady, setIsReady, store, routeFromState };
}

export default UrlSync;
