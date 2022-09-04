import React from "react";
import { Counter, counterReducer } from "../domain/entities/Counter";

interface CounterProps {
    counter: Counter;
    onChange: (counter: Counter) => void;
}

const CounterComponent: React.FC<CounterProps> = props => {
    const { counter, onChange } = props;
    const increment = React.useCallback(
        () => onChange(counterReducer.increment()(counter)),
        [onChange, counter]
    );
    const decrement = React.useCallback(
        () => onChange(counterReducer.decrement()(counter)),
        [onChange, counter]
    );

    return (
        <div>
            <span>
                {counter.id} = {counter.value}
            </span>

            <button onClick={decrement}>- DECREMENT</button>
            <button onClick={increment}>+ INCREMENT</button>
        </div>
    );
};

export default React.memo(CounterComponent);
