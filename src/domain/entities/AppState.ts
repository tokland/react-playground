import { Id } from "./Base";
import { Counter } from "./Counter";

export interface AppState {
    page: Page;
    session: Session;
    counters: Record<Id, Loader<Counter>>;
}

type Page = { type: "home" } | { type: "counter"; id: Id };

type Session = { type: "unauthenticated" } | { type: "loggedIn"; username: string };

type Loader<T> = { type: "loading"; id: Id } | { type: "loaded"; value: T; isUpdating: boolean };

export const selectors = {
    currentCounter: (state: AppState) =>
        state.page.type === "counter" ? state.counters[state.page.id] : undefined,
};
