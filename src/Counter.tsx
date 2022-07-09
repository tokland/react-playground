import React from "react";
import { appContext } from "./App";
import { useContextState } from "./StateContext";

function CounterComponent() {
    const [counter, setState] = useContextState(appContext, state => state.counter);

    const decrement = React.useCallback(
        () => setState(prev => ({ ...prev, counter: { value: prev.counter.value - 1 } })),
        [setState]
    );

    const increment = React.useCallback(
        () => setState(prev => ({ ...prev, counter: { value: prev.counter.value + 1 } })),
        [setState]
    );

    console.debug("Counter:render", counter);

    return (
        <div>
            <span>value = {counter.value}</span>
            <button onClick={increment}>-ONE</button>
            <button onClick={decrement}>+ONE</button>
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
