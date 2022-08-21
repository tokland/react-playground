import { Counter } from "./Counter";

export interface AppState {
    page: Page;
    session: Session;
}

// type Id = number;

//type LoadableById<T> = { type: "loading"; id: Id } | { type: "loaded"; id: Id; value: T };

export type Page = { type: "home" } | { type: "counter"; counter: Counter };

export type Session = { type: "notLogged" } | { type: "logged"; username: string };
