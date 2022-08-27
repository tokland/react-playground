import React from "react";
import { appReducer, useAppState, useAppDispatch } from "../domain/entities/AppReducer";
import { Counter } from "../domain/entities/Counter";
import { useAppContext } from "./AppContext";

interface CounterProps {
    counter: Counter;
    actions: {
        add: (n: number) => void;
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

const CounterApp: React.FC = () => {
    const { compositionRoot } = useAppContext();
    const dispatch = useAppDispatch();
    const counter = useAppState(state =>
        state.page.type === "counter" ? state.page.counter : undefined
    );

    const actions = React.useMemo(() => {
        if (!counter) throw new Error();

        // Move to global view actions? (aware of compositionRoot)
        return {
            add: async (n: number) => {
                const counterUpdated = await compositionRoot.counters.add(counter, n);
                dispatch(appReducer.counter.set(counterUpdated));
            },
        };
    }, [dispatch, counter, compositionRoot]);

    if (!counter) return null;

    return <CounterComponent counter={counter} actions={actions} />;
};

export default CounterApp;
