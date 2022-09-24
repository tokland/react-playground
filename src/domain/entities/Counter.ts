import { Struct } from "./Struct";
import { Id } from "./Base";

/**
 * Immutable identifiable counter.
 *
 * @example
 * ```
 * const counter = new Counter({ id: "c1", value: 1});
 * const counter2 = counter.add(1);
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
