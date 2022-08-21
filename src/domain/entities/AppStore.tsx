import { AppState, Page } from "./AppState";
import { getActionsStore } from "../../webapp/StoreActions";
import { counterReducer } from "./Counter";
import { buildReducer } from "../../libs/reducer";

const countersReducer = buildReducer<AppState["counters"]>()({
    counter1: counterReducer,
    counter2: counterReducer,
});

const appReducer = buildReducer<AppState>()({
    goTo: (page: Page) => state => ({ ...state, page }),
    counters: countersReducer,
});

export const initialAppState: AppState = {
    page: { type: "home" },
    session: { type: "notLogged" },
    counters: {
        counter1: { id: 1, value: 1 },
        counter2: { id: 2, value: 2 },
    },
};

export const { useState: useAppState, useActions: useAppActions } = getActionsStore(
    initialAppState,
    appReducer
);
