import { Id } from "./Base";
import { buildReducer } from "../../libs/reducer";

export interface Counter {
    id: Id;
    value: number;
}

export const counterReducer = buildReducer<Counter>()({
    add: (n: number) => state => ({ ...state, value: state.value + n }),
    increment: () => state => ({ ...state, value: state.value + 1 }),
    decrement: () => state => ({ ...state, value: state.value - 1 }),
});
