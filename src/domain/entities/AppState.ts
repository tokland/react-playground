import { Struct } from "./Struct";
import { Maybe } from "../../libs/ts-utils";
import { Id } from "./Base";
import { Counter } from "./Counter";
import { HashMap } from "./HashMap";

// Implementation details, can be hidden
export interface AppStateAttrs {
    page: Page;
    session: Session;
    counters: HashMap<Id, Loader<Counter>>;
}

export class AppState extends Struct<AppStateAttrs>() {
    login(username: string): AppState {
        return this._update({ session: { type: "loggedIn", username } });
    }

    logout(): AppState {
        return this._update({ session: { type: "unauthenticated" } }).goToHome();
    }

    goToHome() {
        return this._update({ page: { type: "home" } });
    }

    goToCounter(id: Id) {
        return this._update({ page: { type: "counter", id } });
    }

    setCounter(counter: Counter, options?: { isUpdating: boolean }) {
        const { isUpdating = false } = options || {};
        const { counters } = this;
        const loader: Loader<Counter> = { status: "loaded", value: counter, isUpdating };
        return this._update({ counters: counters.set(counter.id, loader) });
    }

    setCounterAsLoading(id: Id) {
        return this._update({
            counters: this.counters.set(id, { status: "loading" }),
        });
    }

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
