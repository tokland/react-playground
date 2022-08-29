import React from "react";
import { useAppState } from "../domain/entities/AppReducer";
import { Counter } from "../domain/entities/Counter";
import { useAppContext } from "./AppContext";

interface CounterProps {
    counter: Counter;
    onAdd: (n: number) => void;
}

function CounterComponent(props: CounterProps) {
    const { counter, onAdd } = props;

    // TODO: Use case
    const addRandom = React.useCallback(async () => {
        const randomValue = await getRandomInteger({ min: 1, max: 10 });
        onAdd(randomValue);
    }, [onAdd]);

    const increment = React.useCallback(() => onAdd(+1), [onAdd]);
    const decrement = React.useCallback(() => onAdd(-1), [onAdd]);

    return (
        <div>
            <h2>Counter {counter.id}</h2>
            <span>value = {counter.value}</span>

            <button onClick={decrement}>-ONE</button>
            <button onClick={increment}>+ONE</button>
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

const AppCounter: React.FC = () => {
    const { store } = useAppContext();
    const counter = useAppState(state => state.counter);
    if (!counter) return null;

    return <CounterComponent counter={counter} onAdd={store.counter.add} />;
};

export default AppCounter;
