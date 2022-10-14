import React from "react";
import { getCompositionRoot } from "../../../compositionRoot";
import { Action as ActionGenerator, AppActions, Feedback } from "../../AppActions";
import UrlSync, { useUrlSync } from "./UrlSync";
import Router, { routeFromState, routes } from "../Router";
import { AppState } from "../../../domain/entities/AppState";
import { getStoreHooks } from "../../StoreHooks";
import { Selector } from "../../hooks/useStoreState";
import { HashMap } from "../../../domain/entities/HashMap";
import "./App.css";
import { Async } from "../../../domain/entities/Async";

const initialAppState = new AppState({
    page: { type: "home" },
    session: { type: "loggedIn", username: "test" },
    counters: HashMap.empty(),
});

const App: React.FC = () => {
    const urlSync = useUrlSync(store, routes, routeFromState);

    return (
        <>
            <UrlSync {...urlSync} />
            {urlSync.isReady && <Router />}
        </>
    );
};

const [store, useAppState] = getStoreHooks(initialAppState);

const feedback: Feedback = {
    success: message => console.log(message),
    error: message => console.error(message),
};

export const actions = new AppActions({ compositionRoot: getCompositionRoot(), feedback });

export { useAppState };

export function useAppStateOrFail<SelectedState>(
    selector: Selector<AppState, SelectedState | undefined>
): SelectedState {
    const value = useAppState(selector);
    if (value === undefined) throw new Error("[useAppStateOrFail] No value");
    return value;
}

export async function dispatch(action: ActionGenerator) {
    const gen = runAction(action);
    let result = gen.next();

    while (!result.done) {
        const value$ = result.value;
        const value = await value$.toPromise();
        result = gen.next(value);
    }
}

export type RunGenerator = Generator<Async<any>, void, void>;

export function* runAction(action: ActionGenerator): RunGenerator {
    let result = action.next();
    let error;

    while (!result.done && !error) {
        switch (result.value.type) {
            case "effect": {
                const val = yield result.value.value$;
                result = action.next(val);
                break;
            }
            case "getState": {
                result = action.next(store.state);
                break;
            }

            case "setStateFn": {
                const newState = result.value.fn(store.state);
                store.setState(newState);
                result = action.next();
                break;
            }
        }
    }
}

export default React.memo(App);
