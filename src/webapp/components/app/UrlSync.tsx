import React from "react";
import { runRouteOnEnterForPath, GenericRoutes } from "../../utils/router";
import { useAppActions, useAppState } from "../../Store";
import { AppState } from "../../../domain/entities/AppState";
import useLocation from "react-use/lib/useLocation";

type State = AppState;

interface UrlSyncProps<Routes extends GenericRoutes> {
    routes: Routes;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
    routeFromState(state: State): string;
}

function UrlSync<Routes extends GenericRoutes>(props: UrlSyncProps<Routes>) {
    const { routes, routeFromState, isReady, setIsReady } = props;
    const state = useAppState(state => state);
    const actions = useAppActions();
    const location = useLocation();

    // Set state from URL
    React.useEffect(() => {
        console.log("change");
        runRouteOnEnterForPath(routes, window.location, actions);
        setIsReady(true);
    }, [location, actions, routes, isReady, setIsReady]);

    // Update URL from state changes
    React.useEffect(() => {
        const currentPath = window.location.pathname;
        const pathFromState = routeFromState(state);

        if (isReady && currentPath !== pathFromState) {
            window.history.pushState(null, "unused", pathFromState);
        }
    }, [state, routes, isReady, routeFromState]);

    return null;
}

export function useUrlSync<State, Routes extends GenericRoutes>(
    routes: Routes,
    routeFromState: (state: State) => string
) {
    const [isReady, setIsReady] = React.useState(false);
    return { routes, isReady, setIsReady, routeFromState };
}

export default UrlSync;
