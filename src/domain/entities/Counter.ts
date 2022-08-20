import { buildReducer } from "../../libs/reducer";

export interface Counter {
    id: number;
    value: number;
}

// TODO: buildReducer / buildNestedReducer
export const counterReducer = buildReducer<Counter>()({
    add: (n: number) => state => ({ ...state, value: state.value + n }),
    increment: () => state => ({ ...state, value: state.value + 1 }),
    decrement: () => state => ({ ...state, value: state.value - 1 }),
});

const counter7 = counterReducer.actions.add(2)({ id: 1, value: 5 });
console.log(counter7);
// TODO: counterReducer.actions
