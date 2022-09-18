import React from "react";
import { useAppContext } from "../components/app/AppContext";
import { useAppStateOrFail } from "../components/app/App";
import Button from "../components/Button";
import Counter from "../components/Counter";
import Session from "../components/Session";
import { useCancellableEffect } from "../hooks/useCancellableEffect";
import create, { StoreApi } from "zustand";

type StoreFrom<State, Actions> = State & { [K in keyof Actions]: Actions[K] };
type Api = StoreApi<CounterState>;

type CounterState = { value: number };

class CounterActions {
    constructor(private get: Api["getState"], private set: Api["setState"]) {}

    addCounter = (n: number) => this.set(state => ({ value: state.value + n }));
    incrementCounter = () => this.addCounter(+1);
    decrementCounter = () => this.addCounter(-1);
}

const initialState: CounterState = { value: 0 };

const useCounterStore = create<StoreFrom<CounterState, CounterActions>>((set, get) => {
    return { ...initialState, ...new CounterActions(get, set) };
});

const CounterPage: React.FC = () => {
    const { actions } = useAppContext();
    const state = useCounterStore(state => state);

    return (
        <>
            <Session />
            <Button onClick={actions.routes.goToHome} text="Back to Home Page" />
            <CurrentCounter />
            <div>{state.value}</div>
            <button onClick={state.incrementCounter}>INC</button>
            <button onClick={state.decrementCounter}>DEC</button>
        </>
    );
};

const CurrentCounter_: React.FC = () => {
    const { actions } = useAppContext();
    const loader = useAppStateOrFail(state => state.currentCounter?.loader);
    const [save, isSaving, cancelSave] = useCancellableEffect(actions.counter.save, {
        cancelOnComponentUnmount: false,
    });

    if (loader.status === "loading") {
        return <div>Loading...</div>;
    } else if (loader.status !== "loaded") {
        return <div>Counter not loaded</div>;
    } else {
        return (
            <Counter
                counter={loader.value}
                onChange={actions.counter.set}
                isSaving={isSaving}
                onSave={save}
                onCancel={cancelSave}
            />
        );
    }
};

const CurrentCounter = React.memo(CurrentCounter_);

export default React.memo(CounterPage);
