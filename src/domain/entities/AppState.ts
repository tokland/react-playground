import { Maybe } from "../../libs/ts-utils";
import { Counter } from "./Counter";

export interface AppState {
    page: Page;
    session: Session;
    counter: Maybe<Counter>;
    isLoading: boolean;
}

type Page = { type: "home" | "counter" };

type Session = { type: "notLogged" } | { type: "logged"; username: string };
