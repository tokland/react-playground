export type AppState = {
    session: { type: "notLogged" } | { type: "logged"; username: string };
    sections: { counter: CounterState };
};

export type CounterState = { value: number };
