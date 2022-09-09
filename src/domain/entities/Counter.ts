import { Id } from "./Base";

export interface Counter {
    id: Id;
    value: number;
    add(n: number): Counter;
}

export class CounterImpl implements Counter {
    constructor(public readonly id: Id, public readonly value: number) {}

    add(n: number): Counter {
        return this.update({ value: this.value + n });
    }

    private update(options: Partial<Omit<Counter, "add">>): Counter {
        return new CounterImpl(options.id ?? this.id, options.value ?? this.value);
    }
}

/*
export const counterReducer = reducer<Counter>()({
    add: (n: number) => state => ({ value: state.value + n }),
});
*/
