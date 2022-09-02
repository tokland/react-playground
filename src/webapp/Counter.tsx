import React from "react";
import { useAppState } from "./AppStateHooks";
import { Counter } from "../domain/entities/Counter";
import { useAppContext } from "./AppContext";

interface CounterProps {
    counter: Counter;
    onAdd: (n: number) => void;
}

function CounterComponent(props: CounterProps) {
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
}

const AppCounter: React.FC = () => {
    const { store } = useAppContext();
    // TODO: useAppStateOrFail(state => state.counter)
    const counter = useAppState(state => state.counter);
    if (!counter) return null;

    return <CounterComponent counter={counter} onAdd={store.counter.add} />;
};

export default AppCounter;
