import React from "react";
import { getCompositionRoot } from "../../../compositionRoot";
import { getStore, StoreWrapper, useStoreState } from "../../AppActions";
import UrlSync, { useUrlSync } from "./UrlSync";
import Router, { routeFromState, routes } from "../Router";
import { AppState } from "../../../domain/entities/AppState";
import { getStoreHooks } from "../../StoreHooks";
import { Selector } from "../../hooks/useStoreState";
import { HashMap } from "../../../domain/entities/HashMap";
import "./App.css";
import Feedback from "../Feedback";

const initialAppState = new AppState({
    page: { type: "home" },
    session: { type: "loggedIn", username: "test" },
    counters: HashMap.empty(),
    feedback: {},
});

const App: React.FC = () => {
    const urlSync = useUrlSync(store, routes, routeFromState);
    const compositionRoot = getCompositionRoot();
    const storeValue = getStore(compositionRoot, initialAppState);

    return (
        <StoreWrapper value={storeValue}>
            <UrlSync {...urlSync} />
            {urlSync.isReady && <Router />}
            <Feedback />
        </StoreWrapper>
    );
};

const [store, useAppState] = getStoreHooks(initialAppState);

export { useAppState };

export function useAppStateOrFail<SelectedState>(
    selector: Selector<AppState, SelectedState | undefined>
): SelectedState {
    const value = useStoreState(selector);
    if (value === undefined) throw new Error("[useAppStateOrFail] No value");
    return value;
}

export default React.memo(App);
