export interface AppState {
    auth: { username: string };
    counters: CountersState;
}

export const initialState = {
    auth: { username: "arnau" },
    counters: { counter1: { value: 1 }, counter2: { value: 2 } },
};

export const initialAppState: CountersState = {
    counter1: { value: 0 },
    counter2: { value: 10 },
    counter3: { value: 20 },
};

export interface CountersState {
    counter1: CounterState;
    counter2: CounterState;
    counter3: CounterState;
}

export interface CounterState {
    value: number;
}
