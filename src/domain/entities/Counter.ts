import { Struct } from "../../libs/struct";
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

export class Counter extends Struct<CounterProperties>() {
    add(n: number): Counter {
        return new Counter({ ...this, value: this.value + n });
    }
}
