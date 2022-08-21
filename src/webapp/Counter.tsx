import React from "react";
import { Counter } from "../domain/entities/Counter";

export interface CounterProps {
    counter: Counter;
    actions: {
        add(n: number): void;
        //increment(): void;
        //decrement(): void;
    };
}

function CounterComponent(props: CounterProps) {
    const { counter, actions } = props;

    // TODO: Use case + repository
    const addRandom = React.useCallback(async () => {
        const randomValue = await getRandomInteger({ min: 1, max: 10 });
        actions.add(randomValue);
    }, [actions]);

    return (
        <div>
            <h2>Counter {counter.id}</h2>
            <span>value = {counter.value}</span>

            <button onClick={() => actions.add(-1)}>-ONE</button>
            <button onClick={() => actions.add(+1)}>+ONE</button>
            <button onClick={addRandom}>+RANDOM</button>
        </div>
    );
}

async function getRandomInteger(options: { min: number; max: number }): Promise<number> {
    const { min, max } = options;
    const value = Math.floor(Math.random() * (max - min) + min);

    return new Promise(resolve => {
        window.setTimeout(() => resolve(value), 1000);
    });
}

export default React.memo(CounterComponent);
