import React from "react";
import { useAppStore } from "./AppStore";

function CounterComponent() {
    const [counter, actions] = useAppStore(state => state.sections.counter);

    const addRandom = React.useCallback(async () => {
        const randomValue = await getRandomInteger({ min: 1, max: 10 });
        actions.sections.counter.add(randomValue);
    }, [actions]);

    return (
        <div>
            <span>value = {counter.value}</span>

            <button onClick={actions.sections.counter.decrement}>-ONE</button>
            <button onClick={actions.sections.counter.increment}>+ONE</button>
            <button onClick={addRandom}>+RANDOM</button>
        </div>
    );
}

async function getRandomInteger(options: { min: number; max: number }): Promise<number> {
    const { min, max } = options;
    const value = Math.floor(Math.random() * (max - min) + min);

    return new Promise(resolve => {
        window.setTimeout(() => resolve(value), 1e3);
    });
}

export const Counter = React.memo(CounterComponent);
