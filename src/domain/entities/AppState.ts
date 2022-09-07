import { Id } from "./Base";
import { Counter } from "./Counter";

export interface AppState {
    page: Page;
    session: Session;
    counter: Loader<Counter>;
}

type Page = { type: "home" } | { type: "counter"; id: Id };

type Session = { type: "unauthenticated" } | { type: "loggedIn"; username: string };

type Loader<T> =
    | { type: "off" }
    | { type: "loading" }
    | { type: "loaded"; value: T; isUpdating: boolean };
