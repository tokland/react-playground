import React from "react";
import { getCompositionRoot } from "../../../compositionRoot";
import { useAppState, useAppStore } from "../../Store";
import UrlSync, { useUrlSync } from "./UrlSync";
import Router, { urlFromState, routes } from "../Router";
import { AppState } from "../../../domain/entities/AppState";
import { HashMap } from "../../../domain/entities/HashMap";
import "./App.css";
import Feedback from "../Feedback";
import { AppActions } from "../../AppActions";

const initialAppState = new AppState({
    page: { type: "home" },
    session: { type: "loggedIn", username: "test" },
    counters: HashMap.empty(),
    feedback: {},
});

const App: React.FC = () => {
    const urlSync = useUrlSync(routes, urlFromState);

    const StoreProvider = useAppStore(store => {
        const compositionRoot = getCompositionRoot();
        const actions = new AppActions({ compositionRoot, store });
        return { initialState: initialAppState, actions };
    });

    return (
        <StoreProvider>
            <UrlSync {...urlSync} />
            {urlSync.isReady && <Router />}
            <Feedback />
        </StoreProvider>
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
