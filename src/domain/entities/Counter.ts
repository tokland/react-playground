import { Id } from "./Base";

interface CounterData {
    id: Id;
    value: number;
}

export interface Counter extends CounterData {
    add(n: number): Counter;
}

export const Counter2 = {
    reducers: 1,
    selectors: 2,
};

export class CounterImpl implements Counter {
    constructor(public readonly id: Id, public readonly value: number) {}

    add(n: number): Counter {
        return new CounterImpl(this.id, this.value + n);
        //return this.update({ value: this.value + n });
    }

    private update(options: Partial<CounterData>): Counter {
        return new CounterImpl(options.id ?? this.id, options.value ?? this.value);
    }
}

/*
export const counterReducer = reducer<Counter>()({
    add: (n: number) => state => ({ value: state.value + n }),
});
*/
