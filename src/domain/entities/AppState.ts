import { reducer } from "../../libs/reducer";
import { Maybe } from "../../libs/ts-utils";
import { Id } from "./Base";
import { Counter } from "./Counter";

export interface AppState {
    page: Page;
    session: Session;
    counter: Maybe<Counter>;
    isLoading: boolean;
}

type Page = { type: "home" } | { type: "counter"; id: Id; isLoading: boolean };

type Session = { type: "notLogged" } | { type: "logged"; username: string };

const _appReducer = reducer<AppState>()({
    setPage: (page: Page) => state => ({ ...state, page }),
    logout: () => state => ({ ...state, session: { type: "notLogged" } }),
    setCounter: (counter: Counter) => state => ({ ...state, counter }),
});
