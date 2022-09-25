import { Struct } from "./Struct";
import { Maybe } from "../../libs/ts-utils";
import { Id } from "./Base";
import { Counter } from "./Counter";
import { HashMap } from "./HashMap";

export interface AppStateAttrs {
    page: Page;
    session: Session;
    counters: HashMap<Id, Loader<Counter>>;
}

export class AppState extends Struct<AppStateAttrs>() {
    get loggedUsername(): Maybe<string> {
        return this.session.type === "loggedIn" ? this.session.username : undefined;
    }

    get currentCounter(): { loader: Maybe<Loader<Counter>>; counter: Maybe<Counter> } {
        const loader = this.page.type === "counter" ? this.counters.get(this.page.id) : undefined;
        const counter = loader?.status === "loaded" ? loader.value : undefined;
        return { loader, counter };
    }

    counterIdFromIndex(index: number): Maybe<Id> {
        return this.loggedUsername !== undefined ? `${this.loggedUsername}-${index}` : undefined;
    }
}

type Page = { type: "home" } | { type: "counter"; id: Id };

type Session = { type: "unauthenticated" } | { type: "loggedIn"; username: string };

export type Loader<T> =
    | { status: "off" }
    | { status: "loading" }
    | { status: "loaded"; value: T; isUpdating?: boolean };
