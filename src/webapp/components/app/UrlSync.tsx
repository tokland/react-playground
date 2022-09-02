import React from "react";
import { useAppState } from "../../AppStateHooks";
import { AppStore } from "../../AppStore";
import { Route } from "../../utils/router";

interface UrlSyncProps {
    store: AppStore;
    routes: GenericRoute[];
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UrlSync: React.FC<UrlSyncProps> = props => {
    const { store, routes, isReady, setIsReady } = props;
    const state = useAppState(state => state);

    // Set state from initial URL
    React.useEffect(() => {
        async function run() {
            const path = window.location.pathname;
            await runStoreActionFromPath(routes, store, path);
            setIsReady(true);
        }
        run();
    }, [store, routes, setIsReady]);

    // Update URL from state changes
    React.useEffect(() => {
        const currentPath = window.location.pathname;
        const pathFromState = getPathFromState(routes, state);

        if (isReady && currentPath !== pathFromState) {
            window.history.pushState(state, "unused", pathFromState);
        }
    }, [state, routes, isReady]);

    // Update state on Back/Forward browser actions
    React.useEffect(() => {
        window.addEventListener("popstate", () => {
            const currentPath = window.location.pathname;
            runStoreActionFromPath(routes, store, currentPath);
        });
    }, [store, routes]);

    return null;
};

export function useUrlSync() {
    const [isReady, setIsReady] = React.useState(false);
    return { isReady, setIsReady };
}

export async function runStoreActionFromPath<Store>(
    routes: GenericRoute[],
    store: Store,
    path: string
) {
    routes.forEach(route => {
        // Convert "/some/path/[id]/[value]" to Regexp /some/path/(?<id>[\w-_]+)/?<value>[\w-_]+
        const re = route.path.replace(/\[(\w+)\]/, "(?<$1>[\\w-_]+)");
        const match = path.match(new RegExp(re));

        if (match) {
            const args = match.groups as Parameters<typeof route.onEnter>[0]["args"]; // ExtractArgsFromPath<typeof route.path>;
            route.onEnter({ store, args, params: {} });
        }
    });
}

type GenericRoute = Route<any, any, any, any>;

export function getPathFromState<State>(routes: GenericRoute[], state: State): string {
    for (const route of routes) {
        const res = route.fromState(state);

        switch (res) {
            case true:
                return route.path;
            case false:
                continue;
            default:
                return res;
        }
    }

    return "/";
}
