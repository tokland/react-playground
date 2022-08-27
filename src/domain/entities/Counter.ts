import { buildSimpleReducer } from "../../libs/reducer";

export interface Counter {
    id: number;
    value: number;
}

export const counterReducer = buildSimpleReducer<Counter>()({
    add: (n: number) => state => ({ ...state, value: state.value + n }),
    increment: () => state => ({ ...state, value: state.value + 1 }),
    decrement: () => state => ({ ...state, value: state.value - 1 }),
});
