import { Struct } from "../../libs/struct";
import { Maybe } from "../../libs/ts-utils";
import { Id } from "./Base";
import { Counter } from "./Counter";

export interface AppStateAttrs {
    page: Page;
    session: Session;
    counters: Record<Id, Loader<Counter>>;
}

export class AppState extends Struct<AppStateAttrs>() {
    get currentCounterLoader(): Maybe<Loader<Counter>> {
        return this.page.type === "counter" ? this.counters[this.page.id] : undefined;
    }
}

type Page = { type: "home" } | { type: "counter"; id: Id };

type Session = { type: "unauthenticated" } | { type: "loggedIn"; username: string };

type Loader<T> =
    | { status: "off" }
    | { status: "loading"; id: Id }
    | { status: "loaded"; value: T; isUpdating: boolean };
