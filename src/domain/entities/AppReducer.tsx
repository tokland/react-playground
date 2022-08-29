import { AppState, Page } from "./AppState";
import { getStoreHooks } from "../../webapp/StoreHooks";
import { Counter } from "./Counter";

function reducer(updater: (state: AppState) => AppState) {
    return updater;
}

const _appReducer = {
    setPage: (page: Page) => reducer(state => ({ ...state, page })),
    logout: () => reducer(state => ({ ...state, session: { type: "notLogged" } })),
    counter: {
        set: (counter: Counter) => reducer(state => ({ ...state, counter })),
    },
};

const initialAppState: AppState = {
    page: { type: "home" },
    session: { type: "logged", username: "arnau" },
    counter: undefined,
    isLoading: false,
};

const [useAppState, useAppSetState] = getStoreHooks(initialAppState);

export { useAppState, useAppSetState };
