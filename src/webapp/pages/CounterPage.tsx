import React from "react";
import { Counter as CounterE } from "../../domain/entities/Counter";
import { useAppActions } from "../Store";
import { useAppStateOrFail } from "../components/app/App";
import Counter from "../components/Counter";
import Link from "../components/Link";
import Session from "../components/Session";
import { useCancellableEffect } from "../hooks/useCancellableEffect";
import { routes } from "../components/Router";

const CounterPage: React.FC = () => {
    const homePageRoute = routes.home.build({});

    return (
        <>
            <Session />
            <Link to={homePageRoute}>Back to Home Page</Link>
            <CurrentCounter />
        </>
    );
};

const CurrentCounter_: React.FC = () => {
    const loader = useAppStateOrFail(state => state.currentCounter?.loader);
    const actions = useAppActions();

    const saveCb = React.useCallback(
        (counter: CounterE) => actions.counter.save(counter),
        [actions]
    );

    const [save, cancelSave] = useCancellableEffect(saveCb);

    if (loader.status === "loading") {
        return <div>Loading...</div>;
    } else if (loader.status !== "loaded") {
        return <div>Counter not loaded</div>;
    } else {
        return (
            <>
                <Counter
                    counter={loader.value}
                    onChange={counter => actions.counter.setCounter(counter)}
                    isSaving={loader.isUpdating}
                    onSave={save}
                    onCancel={cancelSave}
                />
            </>
        );
    }
};

const CurrentCounter = React.memo(CurrentCounter_);

export default React.memo(CounterPage);
