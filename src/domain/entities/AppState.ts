import { Id } from "./Base";
import { Counter } from "./Counter";

export interface AppStateProperties {
    page: Page;
    session: Session;
    counters: Record<Id, Loader<Counter>>;
}

function struct<T>() {
    return class {
        constructor(values: T) {
            Object.assign(this, values || {});
        }
    } as new (values: T) => T;
}

export class AppState extends struct<AppStateProperties>() {
    get currentCounter() {
        return this.page.type === "counter" ? this.counters[this.page.id] : undefined;
    }

    update(state: Partial<AppStateProperties>) {
        return new AppState({ ...this, ...state });
    }
}

type Page = { type: "home" } | { type: "counter"; id: Id };

type Session = { type: "unauthenticated" } | { type: "loggedIn"; username: string };

type Loader<T> =
    | { type: "off" }
    | { type: "loading"; id: Id }
    | { type: "loaded"; value: T; isUpdating: boolean };

/*
export const selectors = {
    currentCounter: (state: AppState) =>
        state.page.type === "counter" ? state.counters[state.page.id] : { type: "off" },
};
*/
