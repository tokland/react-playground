import React from "react";
import "./App.css";
import { getCompositionRoot } from "../../../compositionRoot";
import { Action, ActionYield, AppActions } from "../../AppActions";
import UrlSync, { useUrlSync } from "./UrlSync";
import Router, { routeFromState, routes } from "../Router";
import { AppState } from "../../../domain/entities/AppState";
import { getStoreHooks } from "../../StoreHooks";
import { Selector } from "../../hooks/useStoreState";
import { HashMap } from "../../../domain/entities/HashMap";

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

export function dispatch(action: Generator<ActionYield, void, void>): void {
    console.log("dispatch", action);
    runGenerator(action);
}

async function runGenerator(gen: Action) {
    let result = gen.next();
    let error;

    while (!result.done && !error) {
        /* console.log(state, result); */

        const state = store.state;

        switch (result.value.type) {
            case "effect": {
                let val;

                try {
                    val = await result.value.value$.toPromise(); // TOFIX
                    result = gen.next(val);
                } catch (err: any) {
                    console.log("Error-catch:", err.message);
                    error = err;
                }
                break;
            }
            case "getState":
                result = gen.next(state as any);
                break;

            /*
            case "setState":
                state = result.value.state;
                result = gen.next();
                break;
            */

            case "setStateFn": {
                const state2 = result.value.fn(state);
                store.setState(state2);
                result = gen.next();
                break;
            }
        }
    }

    //return error ? { type: "error", state, error } : { type: "success", state };
}

export default React.memo(App);
