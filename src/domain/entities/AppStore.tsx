import { AppState, Page } from "./AppState";
import { getStoreHooks } from "../../webapp/StoreHooks";
import { Counter, counterReducer } from "./Counter";

function reducer(updater: (state: AppState) => AppState) {
    return updater;
}

export const appReducer = {
    goTo: (page: Page) => reducer(state => ({ ...state, page })),
    // counter: onPageType("counter", counterReducer)
    // counter: forPageType("counter", { add: (n: number) => counterReducer.add(n), ... })
    counter: {
        set: (counter: Counter) =>
            reducer(state =>
                state.page.type === "counter"
                    ? { ...state, page: { type: "counter", counter } }
                    : state
            ),
        // add: pageAction((n: number) => counterReducer.add(n))
        add: (n: number) =>
            // pageReducerForPageType("counter", counterReducer.add(n))
            reducer(state =>
                state.page.type === "counter"
                    ? {
                          ...state,
                          page: {
                              type: "counter",
                              counter: counterReducer.add(n)(state.page.counter),
                          },
                      }
                    : state
            ),
    },
};

const initialAppState: AppState = {
    page: { type: "home" },
    session: { type: "notLogged" },
};

const hooks = getStoreHooks(initialAppState);

export const { useState: useAppState, useDispatch: userAppDispatch } = hooks;
