import React from "react";
import { useAppStore } from "./AppStore";

function CounterComponent() {
    const [counter, actions] = useAppStore(state => state.counter);

    return (
        <div>
            <span>value = {counter.value}</span>

            <button onClick={actions.decrement}>-ONE</button>
            <button onClick={actions.increment}>+ONE</button>
            <button onClick={actions.addRandom}>+RANDOM</button>
        </div>
    );
}

export const Counter = React.memo(CounterComponent);
