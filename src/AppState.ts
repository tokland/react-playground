import { ProxyLens, lens } from "proxy-lens";

export type AppState = {
    counter: CounterState;
    session: { type: "notLogged" } | { type: "logged"; username: string };
};

export type CounterState = { value: number };

export const initialAppState: AppState = {
    counter: { value: 0 },
    session: { type: "notLogged" },
};

export class AppStateReducer {
    lens: ProxyLens<AppState, AppState>;

    constructor(private state: AppState) {
        this.lens = lens(this.state);
    }

    addCounter(n: number): AppState {
        return this.lens.counter.value.mod(prev => prev + n).get();
    }
}
