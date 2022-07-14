import { ProxyLens, lens } from "proxy-lens";

export type AppState = {
    session: { type: "notLogged" } | { type: "logged"; username: string };
    sections: { counter: CounterState };
};

export type CounterState = { value: number };

export class AppStateReducer {
    lens: ProxyLens<AppState, AppState>;

    constructor(private state: AppState) {
        this.lens = lens(this.state);
    }

    addCounter(n: number): AppState {
        return this.lens.sections.counter.value.mod(prev => prev + n).get();
    }
}
