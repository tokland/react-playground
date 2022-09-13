import React from "react";
import { useAppState } from "./App";
import { getPathFromRoute, Route, runRouteOnEnterForPath } from "../../utils/router";
import { routeFromState } from "../Router";

interface UrlSyncProps {
    store: unknown;
    routes: Record<string, Route>;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
}

const UrlSync: React.FC<UrlSyncProps> = props => {
    const { store, routes, isReady, setIsReady } = props;
    const state = useAppState(state => state);

    // useLatest
    const stateRef = React.useRef(state);
    React.useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Set state from initial URL
    React.useEffect(() => {
        async function run() {
            const path = window.location.pathname;
            await runRouteOnEnterForPath(routes, stateRef.current, store, path);
            setIsReady(true);
        }

        if (!isReady) run();
    }, [store, routes, isReady, setIsReady]);

    // Update URL from state changes
    React.useEffect(() => {
        const currentPath = window.location.pathname;
        const pathFromState = getPathFromRoute(routes, routeFromState(state));

        if (isReady && currentPath !== pathFromState) {
            window.history.pushState(state, "unused", pathFromState);
        }
    }, [state, routes, isReady]);

    // Update state on Back/Forward browser actions
    React.useEffect(() => {
        const handler = () => {
            const currentPath = window.location.pathname;
            runRouteOnEnterForPath(routes, stateRef.current, store, currentPath);
        };
        window.addEventListener("popstate", handler);

        return () => window.removeEventListener("popstate", handler);
    }, [store, routes]);

    return null;
};

export function useUrlSync() {
    const [isReady, setIsReady] = React.useState(false);
    return { isReady, setIsReady };
}

export default React.memo(UrlSync);
