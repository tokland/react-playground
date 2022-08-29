import { AppState, Page } from "./AppState";
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
