import React from "react";
import { useAppContext } from "../components/app/AppContext";
import { useAppStateOrFail } from "../components/app/App";
import Button from "../components/Button";
import Counter from "../components/Counter";
import Session from "../components/Session";
import { useCancellableEffect } from "../hooks/useCancellableEffect";

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
