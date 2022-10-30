import { Struct } from "./Struct";
import { Id } from "./Base";
import _ from "lodash";

/**
 * Immutable counter.
 *
 * @example
 * ```
 * const counter1 = new Counter({ id: "someCounter", value: 1 });
 * const counter2 = counter1.add(1);
 * console.log(counter1.value); // 1
 * console.log(counter2.value); // 2
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

const counter = Counter.create({ id: "k2", value: 2 });
console.log(counter);
