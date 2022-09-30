import React from "react";
import { getCompositionRoot } from "../../../compositionRoot";
import { Action, AppActions } from "../../AppActions";
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

export const actions = new AppActions({
    compositionRoot: getCompositionRoot(),
    store,
});

export { useAppState };

export function useAppStateOrFail<SelectedState>(
    selector: Selector<AppState, SelectedState | undefined>
): SelectedState {
    const value = useAppState(selector);
    if (value === undefined) throw new Error("[useAppStateOrFail] No value");
    return value;
}

export async function dispatch(action: Action) {
    const gen = runGenerator(action);
    let result = gen.next();

    while (!result.done) {
        const value$ = result.value;
        const value = await value$.toPromise();
        result = gen.next(value);
    }
}

export type RunGenerator = Generator<Async<any>, void, void>;

export function* runGenerator(action: Action): RunGenerator {
    let result = action.next();
    let error;

    while (!result.done && !error) {
        const state = store.state;

        switch (result.value.type) {
            case "effect": {
                try {
                    const val = yield result.value.value$;
                    result = action.next(val);
                } catch (err: any) {
                    console.log("Error-catch:", err.message);
                    error = err;
                }
                break;
            }
            case "getState":
                result = action.next(state as any);
                break;

            case "setStateFn": {
                const state2 = result.value.fn(state);
                store.setState(state2);
                result = action.next();
                break;
            }
        }
    }
}

export default React.memo(App);
