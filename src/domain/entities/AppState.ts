import { Maybe } from "../../libs/ts-utils";
import { Id } from "./Base";
import { Counter } from "./Counter";

export interface AppState {
    page: Page; // Remove Page[type=counter].isLoading
    session: Session;
    counter: Maybe<Counter>;
    isLoading: boolean;
    // counters: Record<Id, Counter>;
    // loaders: Array<{ type: "counter", id: Id }>
}

type Page = { type: "home" } | { type: "counter"; id: Id; isLoading: boolean };

type Session = { type: "notLogged" } | { type: "logged"; username: string };
