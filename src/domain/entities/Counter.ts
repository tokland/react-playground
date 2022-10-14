import { Struct } from "./Struct";
import { Id } from "./Base";
import _ from "lodash";

/**
 * Immutable counter.
 *
 * @example
 * ```
 * const counter1 = new Counter({ id: "c1", value: 1 });
 * const counter2 = counter1.add(1);
 * const counter2.value; // 2
 * ```
 */

interface CounterAttrs {
    id: Id;
    value: number;
}

export class Counter extends Struct<CounterAttrs>() {
    add(n: number): Counter {
        return this._update({ value: this.value + n });
    }
}

type GetUpdaters<T> = {
    [P in keyof T]-?: T[P] extends (...args: any[]) => T ? P : never;
}[keyof T];

type ReducerOf<T> = {
    [K in GetUpdaters<T>]: T[K] extends (...args: infer Args) => T
        ? (...args: Args) => (obj: T) => T
        : never;
};

export function buildReducer<T>(ctor: new (...args: any[]) => T): ReducerOf<T> {
    return _(Object.getOwnPropertyNames(ctor.prototype))
        .map(key => {
            const fn =
                (...args: any[]) =>
                (obj: T) =>
                    (obj as any)[key].bind(obj)(...args);

            return [key, fn] as const;
        })
        .fromPairs()
        .value() as unknown as ReducerOf<T>;
}

const counter1 = new Counter({ id: "1", value: 1 });
const counter$ = buildReducer(Counter);
const counter2 = counter$.add(1)(counter1);
console.log(counter2);
