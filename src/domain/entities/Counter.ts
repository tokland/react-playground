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

console.log(new Counter({ id: "1", value: 3 }).add(5));
