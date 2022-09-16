import { Struct } from "../../libs/struct";
import { Id } from "./Base";

interface CounterAttrs {
    id: Id;
    value: number;
}

export class Counter extends Struct<CounterAttrs>() {
    add(n: number): Counter {
        return this._update({ value: this.value + n });
    }
}
