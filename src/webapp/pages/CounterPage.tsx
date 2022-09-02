import React from "react";
import { useAppContext } from "../AppContext";
import { useAppState } from "../AppStateHooks";
import Button from "../components/Button";
import Counter from "../Counter";
import Session from "../Session";

const CounterPage: React.FC = () => {
    const { store } = useAppContext();

    return (
        <>
            <Session />
            <CounterFromState />
            <Button onClick={store.routes.goToHome} text="Back to Home page" />
        </>
    );
};

declare const _useCancellableEffect: any;

const CounterFromState: React.FC = () => {
    const { store } = useAppContext();
    const counter = useAppState(state => state.counter);
    () => {
        const [_counterAdd, _cancelCounterAdd] = _useCancellableEffect(store.counter.add);
    };
    return <>{counter && <Counter counter={counter} onAdd={store.counter.add} />}</>;
};

export default React.memo(CounterPage);
