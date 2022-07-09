/* State */

export interface AppState {
    counter: CounterState;
}

interface CounterState {
    value: number;
}

export const initialAppState = { counter: { value: 0 } };

/* Reducers */

/*
export class CounterReducer extends Reducer<CounterState> {
    // implements IReducer<CounterReducer> {
    add = (n: number) => ({ ...this.state, value: this.state.value + n });
    increment = () => this.add(1);
    reset = () => ({ ...this.state, value: 0 });
    startUpdate = () => ({ ...this.state, updating: true });
    stopUpdate = () => ({ ...this.state, updating: false });
}
*/
