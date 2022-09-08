import React from "react";
import { useAppContext } from "../components/app/AppContext";
import { useAppState } from "../components/app/App";
import Button from "../components/Button";
import Counter from "../components/Counter";
import Session from "../components/Session";
import { useCancellableEffect } from "../hooks/useCancellableEffect";
import { selectors } from "../../domain/entities/AppState";

const CounterPage: React.FC = () => {
    const { actions } = useAppContext();

    return (
        <>
            <Session />
            <Button onClick={actions.routes.goToHome} text="Back to Home Page" />
            <CurrentCounter />
        </>
    );
};

const CurrentCounter: React.FC = () => {
    const { actions } = useAppContext();
    const loader = useAppState(selectors.currentCounter);
    const counter = loader && loader.type === "loaded" ? loader.value : undefined;
    const [save, isSaving, cancelSave] = useCancellableEffect(actions.counter.save);

    if (loader && loader.type === "loading") {
        return <div>Loading...</div>;
    } else if (!counter) {
        return <div>Counter not loaded</div>;
    } else {
        return (
            <Counter
                counter={counter}
                onChange={actions.counter.set}
                isSaving={isSaving}
                onSave={save}
                onCancel={cancelSave}
            />
        );
    }
};

export default React.memo(CounterPage);
