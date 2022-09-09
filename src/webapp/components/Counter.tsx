import React from "react";
import { Counter } from "../../domain/entities/Counter";

interface CounterProps {
    counter: Counter;
    onChange: (counter: Counter) => void;
    onSave: (counter: Counter) => void;
    onCancel: () => void;
    isSaving: boolean;
}

const CounterComponent: React.FC<CounterProps> = props => {
    const { counter, onChange, onSave, onCancel, isSaving } = props;

    const increment = React.useCallback(() => {
        onChange(counter.add(+1));
    }, [onChange, counter]);

    const decrement = React.useCallback(() => {
        onChange(counter.add(-1));
    }, [onChange, counter]);

    const save = React.useCallback(() => {
        onSave(counter);
    }, [onSave, counter]);

    return (
        <div>
            <span>
                {counter.id} = {counter.value}
            </span>

            <button onClick={decrement}>- DECREMENT</button>
            <button onClick={increment}>+ INCREMENT</button>

            <button onClick={save} disabled={isSaving}>
                SAVE
            </button>

            <button onClick={onCancel} disabled={!isSaving}>
                CANCEL
            </button>
        </div>
    );
};

export default React.memo(CounterComponent);
