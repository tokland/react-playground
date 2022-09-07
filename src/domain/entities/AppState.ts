import { Id } from "./Base";
import { Counter } from "./Counter";

export interface AppState {
    page: Page;
    session: Session;
    counter: Loader<Counter>;
    isLoading: boolean;
}

type Page = { type: "home" } | { type: "counter" };

type Session = { type: "notLogged" } | { type: "logged"; username: string };

type Loader<T> =
    | { type: "off" }
    | { type: "loading"; id: Id }
    | { type: "loaded"; id: Id; value: T; isUpdating: boolean };
