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
    update(attributes: Partial<AppStateAttrs>) {
        return this._update(attributes);
    }

    get loggedSession(): Maybe<Extract<Session, { type: "loggedIn" }>> {
        return this.session.type === "loggedIn" ? this.session : undefined;
    }

    get currentCounter(): { loader: Maybe<Loader<Counter>>; counter: Maybe<Counter> } {
        const loader = this.page.type === "counter" ? this.counters[this.page.id] : undefined;
        const counter = loader?.status === "loaded" ? loader.value : undefined;
        return { loader, counter };
    }

    counterIdFromIndex(index: number): Maybe<Id> {
        const username = this.loggedSession?.username;
        return username !== undefined ? `${username}-${index}` : undefined;
    }
}

type Page = { type: "home" } | { type: "counter"; id: Id };

type Session = { type: "unauthenticated" } | { type: "loggedIn"; username: string };

type Loader<T> =
    | { status: "off" }
    | { status: "loading"; id: Id }
    | { status: "loaded"; value: T; isUpdating: boolean };
