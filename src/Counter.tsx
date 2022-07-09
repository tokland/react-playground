import React from "react";
import { appContext } from "./App";
import { app, AppState } from "./AppReducer";
import { Dispatcher, useContextState } from "./StateContext";

function addRandomDispatcher(dispatch: Dispatcher<AppState>) {
    dispatch(app.counter.startUpdate());

    return getRandom().then(num => {
        dispatch(app.counter.add(num));
        dispatch(app.counter.stopUpdate());
    });
}

function CounterComponent() {
    const [counter, dispatch] = useContextState(appContext, state => state.counter);

    const addRandom = React.useCallback(() => addRandomDispatcher(dispatch), [dispatch]);
    const decrement = React.useCallback(() => dispatch(app.counter.add(-1)), [dispatch]);
    // const decrement = React.useCallback(() => setState(prev => new Reducer(prev).increment()), [setState]);
    // const decrement2 = React.useCallback(() => setState(prev => new Reducer(prev).increment()), [setState]);
    // const [counter, actions] = useMyState(state => state.counter)
    // actions.increment

    console.debug("Counter:render", counter);

    return (
        <div>
            <span>value = {counter.value}</span>
            <button onClick={decrement}>-ONE</button>
            <button onClick={addRandom}>+RANDOM</button>
            <span>{counter.updating ? `[updating]` : ""}</span>
        </div>
    );
}

export const Counter = React.memo(CounterComponent);

export async function getRandom(
    options: { min: number; max: number } = { min: 1, max: 10 }
): Promise<number> {
    const { min, max } = options;
    const n = Math.floor(Math.random() * (max - min) + min);

    return new Promise(resolve => {
        window.setTimeout(() => resolve(n), 2_000);
    });
}
