import { AppState } from "./AppState";
import { buildReducer, getActionsStore } from "../../webapp/StoreActions";
import { Counter } from "./Counter";

const counterReducer = buildReducer<Counter>()({
    add: (n: number) => state => ({ value: state.value + n }),
    increment: () => state => ({ value: state.value + 1 }),
    decrement: () => state => ({ value: state.value - 1 }),
});

const appReducer = buildReducer<AppState>()({
    goTo: (page: AppState["page"]) => state => ({ ...state, page }),
    counter: counterReducer,
});

export const initialAppState: AppState = {
    page: { type: "home" },
    session: { type: "notLogged" },
    counter: { value: 0 },
};

export const useAppStore = getActionsStore(initialAppState, appReducer);
