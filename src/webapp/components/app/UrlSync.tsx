import React from "react";
import { useAppState } from "./App";
import { getPathFromRoute, runRouteOnEnterForPath, Routes } from "../../utils/router";
import { routeFromState } from "../Router";
import { useLatestRef } from "../../hooks/useStoreState";

interface UrlSyncProps {
    store: unknown;
    routes: Routes;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
}

const UrlSync: React.FC<UrlSyncProps> = props => {
    const { store, routes, isReady, setIsReady } = props;
    const state = useAppState(state => state);
    const stateRef = useLatestRef(state);

    // Set state from initial URL
    React.useEffect(() => {
        async function run() {
            const path = window.location.pathname;
            await runRouteOnEnterForPath(routes, stateRef.current, store, path);
            setIsReady(true);
        }

        if (!isReady) run();
    }, [store, routes, isReady, setIsReady, stateRef]);

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
    }, [store, routes, stateRef]);

    return null;
};

export function useUrlSync() {
    const [isReady, setIsReady] = React.useState(false);
    return { isReady, setIsReady };
}

export default React.memo(UrlSync);
