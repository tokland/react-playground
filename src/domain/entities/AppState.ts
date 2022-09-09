import { Maybe } from "../../libs/ts-utils";
import { Id } from "./Base";
import { Counter } from "./Counter";

export interface AppState {
    page: Page;
    session: Session;
    counters: Record<Id, Loader<Counter>>;
    currentCounter: Maybe<Loader<Counter>>;
    update(state: Partial<Options>): AppState;
}

type Options = Omit<AppState, "currentCounter" | "update">;

export class AppStateImpl implements AppState {
    constructor(private options: Options) {}

    get page() {
        return this.options.page;
    }

    get session() {
        return this.options.session;
    }

    get counters() {
        return this.options.counters;
    }

    get currentCounter() {
        return this.page.type === "counter" ? this.counters[this.page.id] : undefined;
    }

    update(state: Partial<Options>) {
        return new AppStateImpl({ ...this.options, ...state });
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
