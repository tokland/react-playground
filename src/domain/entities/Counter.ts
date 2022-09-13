import { Struct } from "../../libs/struct";
import { Id } from "./Base";

interface CounterAttrs {
    id: Id;
    value: number;
}

/*
export interface Counter extends CounterAttrs {
    add(n: number): Counter;
}
*/

export class Counter extends Struct<CounterAttrs>() {
    add(n: number): Counter {
        return this.update({ value: this.value + n });
    }
}
