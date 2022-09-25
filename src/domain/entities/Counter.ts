import { Struct } from "./Struct";
import { Id } from "./Base";

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
