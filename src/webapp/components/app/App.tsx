import React from "react";
import { getCompositionRoot } from "../../../compositionRoot";
import { getStore, StoreWrapper, useActions, useAppState } from "../../AppActions";
import UrlSync, { useUrlSync } from "./UrlSync";
import Router, { routeFromState, routes } from "../Router";
import { AppState } from "../../../domain/entities/AppState";
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
    const _actions = useActions();
    const urlSync = useUrlSync(routes, routeFromState);
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

type Selector<State, SelectedState> = (state: State) => SelectedState;

export function useAppStateOrFail<SelectedState>(
    selector: Selector<AppState, SelectedState | undefined>
): SelectedState {
    const value = useAppState(selector);
    if (value === undefined) throw new Error("[useAppStateOrFail] No value");
    return value;
}

export default React.memo(App);
