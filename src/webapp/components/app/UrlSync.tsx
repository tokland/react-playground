import React from "react";
import { useAppState } from "./App";
import { getPathFromRoute, runRouteOnEnterForPath, Routes } from "../../utils/router";
import { routeFromState } from "../Router";
import { useLatestRef } from "../../hooks/useStoreState";

interface UrlSyncProps {
    actions: unknown;
    routes: Routes;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
}

const UrlSync: React.FC<UrlSyncProps> = props => {
    const { actions, routes, isReady, setIsReady } = props;
    const state = useAppState(state => state);
    const stateRef = useLatestRef(state);

    // Set state from initial URL
    React.useEffect(() => {
        async function run() {
            await runRouteOnEnterForPath(routes, stateRef.current, actions, window.location);
            setIsReady(true);
        }

        if (!isReady) run();
    }, [actions, routes, isReady, setIsReady, stateRef]);

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
            runRouteOnEnterForPath(routes, stateRef.current, actions, window.location);
        };
        window.addEventListener("popstate", handler);

        return () => window.removeEventListener("popstate", handler);
    }, [actions, routes, stateRef]);

    return null;
};

export function useUrlSync() {
    const [isReady, setIsReady] = React.useState(false);
    return { isReady, setIsReady };
}

export default React.memo(UrlSync);
