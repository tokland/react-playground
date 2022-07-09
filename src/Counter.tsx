import React from "react";
import { useAppContext } from "./AppContext";

function CounterComponent() {
    const [counter, actions] = useAppContext(state => state.counter);

    console.debug("Counter:render", counter);

    return (
        <div>
            <span>value = {counter.value}</span>
            <button onClick={actions.decrement}>-ONE</button>
            <button onClick={actions.increment}>+ONE</button>
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
