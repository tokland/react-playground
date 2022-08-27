import { AppState, Page } from "./AppState";
import { getStoreHooks } from "../../webapp/StoreHooks";
import { counterReducer } from "./Counter";

function reducer(updater: (state: AppState) => AppState) {
    return updater;
}
export const appReducer = {
    goTo: (page: Page) => reducer(state => ({ ...state, page })),
    counter: {
        add: (n: number) =>
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
