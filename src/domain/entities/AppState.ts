import { Struct } from "../../libs/struct";
import { Maybe } from "../../libs/ts-utils";
import { Id } from "./Base";
import { Counter } from "./Counter";

interface AppStateAttrs {
    page: Page;
    session: Session;
    counters: Record<Id, Loader<Counter>>;
}

export class AppState extends Struct<AppStateAttrs>() {
    get currentCounter(): Maybe<{ loader: Loader<Counter>; counter: Maybe<Counter> }> {
        const loader = this.page.type === "counter" ? this.counters[this.page.id] : undefined;
        const counter = loader?.status === "loaded" ? loader.value : undefined;
        return loader ? { loader, counter } : undefined;
    }

    get loggedSession(): Maybe<Extract<Session, { type: "loggedIn" }>> {
        return this.session.type === "loggedIn" ? this.session : undefined;
    }
}

type Page = { type: "home" } | { type: "counter"; id: Id };

type Session = { type: "unauthenticated" } | { type: "loggedIn"; username: string };

type Loader<T> =
    | { status: "off" }
    | { status: "loading"; id: Id }
    | { status: "loaded"; value: T; isUpdating: boolean };
