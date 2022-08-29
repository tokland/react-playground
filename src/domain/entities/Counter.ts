import { Id } from "./Base";
import { reducer } from "../../libs/reducer";

export interface Counter {
    id: Id;
    value: number;
}

export const counterReducer = reducer<Counter>()({
    add: (n: number) => state => ({ ...state, value: state.value + n }),
    increment: () => state => ({ ...state, value: state.value + 1 }),
    decrement: () => state => ({ ...state, value: state.value - 1 }),
});
