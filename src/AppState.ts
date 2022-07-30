export interface AppState {
    session: { type: "notLogged" } | { type: "logged"; username: string };
    sections: {
        counter: CounterState;
    };
}

export interface CounterState {
    value: number;
}
