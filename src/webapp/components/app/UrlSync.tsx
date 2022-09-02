import React from "react";
import { useAppState } from "../../AppStateHooks";
import { AppStore } from "../../AppStore";
import { runStoreActionFromPath, getPathFromState } from "../../App";

interface UrlSyncProps {
    store: AppStore;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UrlSync: React.FC<UrlSyncProps> = props => {
    const { store, isReady, setIsReady } = props;
    const state = useAppState(state => state);

    // Set state from initial URL
    React.useEffect(() => {
        async function run() {
            const path = window.location.pathname;
            await runStoreActionFromPath(store, path);
            setIsReady(true);
        }
        run();
    }, [store, setIsReady]);

    // Update URL from state changes
    React.useEffect(() => {
        const currentPath = window.location.pathname;
        const pathFromState = getPathFromState(state);

        if (isReady && currentPath !== pathFromState) {
            window.history.pushState(state, "unused", pathFromState);
        }
    }, [state, isReady]);

    // Update state on Back/Forward browser actions
    React.useEffect(() => {
        window.addEventListener("popstate", () => {
            const currentPath = window.location.pathname;
            runStoreActionFromPath(store, currentPath);
        });
    }, [store]);

    return null;
};

export function useUrlSync() {
    const [isReady, setIsReady] = React.useState(false);
    return { isReady, setIsReady };
}
