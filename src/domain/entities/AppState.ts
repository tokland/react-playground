import { Counter } from "./Counter";

export interface AppState {
    page: Page;
    session: Session;
    counter: Counter | undefined;
    isLoading: boolean;
}

export type Page = { type: "home" | "counter" };

type Session = { type: "notLogged" } | { type: "logged"; username: string };
