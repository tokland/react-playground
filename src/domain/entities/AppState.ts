import { Counter } from "./Counter";

export interface AppState {
    page: Page;
    session: Session;
}

export type Page = { type: "home" } | { type: "counter"; counter: Counter };

type Session = { type: "notLogged" } | { type: "logged"; username: string };
