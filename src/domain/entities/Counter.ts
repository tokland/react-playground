import { Id } from "./Base";

interface CounterProperties {
    id: Id;
    value: number;
}

/*
export interface Counter extends CounterProperties {
    add(n: number): Counter;
}
*/

export class Counter extends struct<CounterProperties>() {
    add(n: number): Counter {
        return new Counter({ ...this, value: this.value + n });
    }
}

function struct<T>() {
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
