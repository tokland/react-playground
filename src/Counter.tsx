import React from "react";
import { useAppStore } from "./AppStore";

function CounterComponent() {
    const [counter, actions] = useAppStore(state => state.counter);

    actions.reset;
    actions.counter;

    return (
        <div>
            <span>value = {counter.value}</span>

            <button onClick={actions.counter.decrement}>-ONE</button>
            <button onClick={actions.counter.increment}>+ONE</button>
            {/*<button onClick={actions.addRandom}>+RANDOM</button>*/}
        </div>
    );
}

export const Counter = React.memo(CounterComponent);
