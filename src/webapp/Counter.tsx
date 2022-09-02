import React from "react";
import { Counter } from "../domain/entities/Counter";

interface CounterProps {
    counter: Counter;
    onAdd: (n: number) => void;
}

const CounterComponent: React.FC<CounterProps> = props => {
    const { counter, onAdd } = props;
    const increment = React.useCallback(() => onAdd(+1), [onAdd]);
    const decrement = React.useCallback(() => onAdd(-1), [onAdd]);

    return (
        <div>
            <h2>Counter {counter.id}</h2>
            <span>value = {counter.value}</span>

            <button onClick={decrement}>-ONE</button>
            <button onClick={increment}>+ONE</button>
        </div>
    );
};

export default React.memo(CounterComponent);
