import { Counter } from "./Counter";

export interface AppState {
    page: Page;
    session: Session;
    counters: {
        counter1: Counter;
        counter2: Counter;
    };
}

export type Page = { type: "home" } | { type: "counter"; id: number };

export type Session = { type: "notLogged" } | { type: "logged"; username: string };
