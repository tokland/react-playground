import React from "react";
import { useAppState } from "../../AppStateHooks";
import { AppActions } from "../../AppActions";
import { Route, getRouterPathFromState, runRouteOnEnterForPath } from "../../utils/router";

interface UrlSyncProps {
    store: AppActions;
    routes: Route[];
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
}

const UrlSync: React.FC<UrlSyncProps> = props => {
    const { store, routes, isReady, setIsReady } = props;
    const state = useAppState(state => state);

    // Set state from initial URL
    React.useEffect(() => {
        async function run() {
            const path = window.location.pathname;
            await runRouteOnEnterForPath(routes, store, path);
            setIsReady(true);
        }
        run();
    }, [store, routes, setIsReady]);

    // Update URL from state changes
    React.useEffect(() => {
        const currentPath = window.location.pathname;
        const pathFromState = getRouterPathFromState(routes, state);

        if (isReady && currentPath !== pathFromState) {
            window.history.pushState(state, "unused", pathFromState);
        }
    }, [state, routes, isReady]);

    // Update state on Back/Forward browser actions
    React.useEffect(() => {
        window.addEventListener("popstate", () => {
            const currentPath = window.location.pathname;
            runRouteOnEnterForPath(routes, store, currentPath);
        });
    }, [store, routes]);

    return null;
};

export function useUrlSync() {
    const [isReady, setIsReady] = React.useState(false);
    return { isReady, setIsReady };
}

export default React.memo(UrlSync);
