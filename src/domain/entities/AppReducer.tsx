import { AppState, Page } from "./AppState";
import { getStoreHooks } from "../../webapp/StoreHooks";
import { Counter } from "./Counter";

function reducer(updater: (state: AppState) => AppState) {
    return updater;
}

export const appReducer = {
    goTo: (page: Page) => reducer(state => ({ ...state, page })),
    logout: () => reducer(state => ({ ...state, session: { type: "notLogged" } })),
    // counter: onPageType("counter", counterReducer)
    // counter: forPageType("counter", { add: (n: number) => counterReducer.add(n), ... })
    counter: {
        set: (counter: Counter) =>
            reducer(state =>
                state.page.type === "counter"
                    ? { ...state, page: { type: "counter", counter } }
                    : state
            ),
    },
};

const initialAppState: AppState = {
    page: { type: "home" },
    session: { type: "logged", username: "arnau" },
};

const hooks = getStoreHooks(initialAppState);

export const { useState: useAppState, useDispatch: useAppDispatch } = hooks;
