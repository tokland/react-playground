import React from "react";
import { getCompositionRoot } from "../../../compositionRoot";
import { Action as ActionGenerator, AppActions } from "../../AppActions";
import UrlSync, { useUrlSync } from "./UrlSync";
import Router, { routeFromState, routes } from "../Router";
import { AppState } from "../../../domain/entities/AppState";
import { getStoreHooks } from "../../StoreHooks";
import { Selector } from "../../hooks/useStoreState";
import { HashMap } from "../../../domain/entities/HashMap";
import "./App.css";
import { Async, AsyncError } from "../../../domain/entities/Async";
import { assertUnreachable } from "../../../libs/ts-utils";
import Feedback from "../Feedback";

const initialAppState = new AppState({
    page: { type: "home" },
    session: { type: "loggedIn", username: "test" },
    counters: HashMap.empty(),
    feedback: {},
});

const App: React.FC = () => {
    const urlSync = useUrlSync(store, routes, routeFromState);

    return (
        <>
            <UrlSync {...urlSync} />
            {urlSync.isReady && <Router />}
            <Feedback />
        </>
    );
};

const [store, useAppState] = getStoreHooks(initialAppState);

export const actions = new AppActions({ compositionRoot: getCompositionRoot() });

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
        const promise = await value$.toPromise();

        try {
            const value = await promise;
            result = gen.next({ type: "success", value });
        } catch (err) {
            result = gen.next({ type: "error", error: err });
        }
    }
}

export type EffectResult<T> =
    | { type: "success"; value: T }
    | { type: "error"; error: AsyncError }
    | { type: "cancelled" };

export type RunGenerator = Generator<Async<unknown>, void, unknown>;

export function* runAction(action: ActionGenerator): RunGenerator {
    let result = action.next();

    while (!result.done) {
        const { value } = result;
        const { type } = value;

        switch (type) {
            case "effect": {
                const val = yield value.value$;
                result = action.next(val);
                break;
            }
            case "getState": {
                result = action.next(store.state);
                break;
            }
            case "setStateFn": {
                const newState = value.fn(store.state);
                store.setState(newState);
                result = action.next();
                break;
            }
            default:
                assertUnreachable(type);
        }
    }
}

export default React.memo(App);
