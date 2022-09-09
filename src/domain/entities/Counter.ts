import { Id } from "./Base";

interface CounterData {
    id: Id;
    value: number;
}

export interface Counter extends CounterData {
    add(n: number): Counter;
}

export class CounterImpl extends auto<CounterData>() {
    add(n: number): Counter {
        return new CounterImpl({ ...this, value: this.value + n });
    }
}

export const Counter = {
    reducers: 1,
    selectors: 2,
};

function auto<T>() {
    return class {
        constructor(values: T) {
            Object.assign(this, values || {});
        }
    } as new (values: T) => T;
}

/*
export const counterReducer = reducer<Counter>()({
    add: (n: number) => state => ({ value: state.value + n }),
});
*/
