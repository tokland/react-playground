import React from "react";
import { useAppContext } from "../components/app/AppContext";
import { useAppState } from "../components/app/App";
import Button from "../components/Button";
import Counter from "../components/Counter";
import Session from "../components/Session";
import { useCancellableEffect } from "../hooks/useCancellableEffect";

const CounterPage: React.FC = () => {
    const { actions } = useAppContext();

    return (
        <>
            <Session />
            <CounterFromState />
            <Button onClick={actions.routes.goToHome} text="Back to Home Page" />
        </>
    );
};

const CounterFromState: React.FC = () => {
    const { actions } = useAppContext();
    const counterLoader = useAppState(state => state.counter);
    const counter = counterLoader.type === "loaded" ? counterLoader.value : undefined;
    const [save, isSaving, cancelSave] = useCancellableEffect(actions.counter.save);

    if (counterLoader.type === "loading") return <div>Loading...</div>;
    if (!counter) return <div>No loader</div>;

    return (
        <div>
            <Counter counter={counter} onChange={actions.counter.set} />

            <button onClick={save} disabled={isSaving}>
                SAVE
            </button>

            <button onClick={cancelSave} disabled={!isSaving}>
                CANCEL
            </button>
        </div>
    );
};

export default React.memo(CounterPage);
