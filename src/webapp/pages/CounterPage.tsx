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
            <Button onClick={store.routes.goToHome} text="Back to Home page" />
            <CounterFromState />
        </>
    );
};

const CounterFromState: React.FC = () => {
    const { store } = useAppContext();
    const counter = useAppState(state => state.counter);

    return <>{counter && <Counter counter={counter} onAdd={store.counter.add} />}</>;
};

export default React.memo(CounterPage);
