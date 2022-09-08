import { Id } from "./Base";
import { reducer } from "../../libs/reducer";

export interface Counter {
    id: Id;
    value: number;
}

export const counterReducer = reducer<Counter>()({
    add: (n: number) => state => ({ value: state.value + n }),
});
