import { Counter } from "./Counter";

export interface AppState {
    page: { type: "home" } | { type: "counter"; id: number };
    session: { type: "notLogged" } | { type: "logged"; username: string };
    counters: {
        counter1: Counter;
        counter2: Counter;
    };
}
