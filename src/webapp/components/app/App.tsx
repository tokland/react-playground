import React from "react";
import { getCompositionRoot } from "../../../compositionRoot";
import { AppActions } from "../../AppActions";
import UrlSync, { useUrlSync } from "./UrlSync";
import Router, { routes } from "../Router";
import { AppState } from "../../../domain/entities/AppState";
import { getStoreHooks } from "../../StoreHooks";
import { Selector } from "../../hooks/useStoreState";
import "./App.css";
import { HashMap } from "@rimbu/hashed";

const initialAppState = new AppState({
    page: { type: "home" },
    session: { type: "loggedIn", username: "test" },
    counters: HashMap.empty(),
});

const [useAppState, actions] = getStoreHooks(initialAppState, store => {
    const compositionRoot = getCompositionRoot();
    return new AppActions({ compositionRoot, store });
});

const App: React.FC = () => {
    const urlSync = useUrlSync();

    return (
        <>
            <UrlSync routes={routes} actions={actions} {...urlSync} />
            {urlSync.isReady && <Router />}
        </>
    );
};

export function useAppStateOrFail<SelectedState>(
    selector: Selector<AppState, SelectedState | undefined>
): SelectedState {
    const value = useAppState(selector);
    if (value === undefined) throw new Error("Cannot get value");
    return value;
}

export { useAppState, actions };

export default React.memo(App);
