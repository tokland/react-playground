import React from "react";
import { actions, dispatch, useAppStateOrFail } from "../components/app/App";
import Counter from "../components/Counter";
import Link from "../components/Link";
import { AppRoute } from "../components/Router";
import Session from "../components/Session";

const CounterPage: React.FC = () => {
    return (
        <>
            <Session />
            <Link to={homePageRoute}>Back to Home Page</Link>
            <CurrentCounter />
        </>
    );
};

const homePageRoute: AppRoute = { key: "home" };

const CurrentCounter_: React.FC = () => {
    const loader = useAppStateOrFail(state => state.currentCounter?.loader);
    /*
    const [save, isSaving, cancelSave] = useCancellableEffect(actions.counter.save, {
        cancelOnComponentUnmount: false,
    });
    */

    if (loader.status === "loading") {
        return <div>Loading...</div>;
    } else if (loader.status !== "loaded") {
        return <div>Counter not loaded</div>;
    } else {
        return (
            <Counter
                counter={loader.value}
                onChange={counter => dispatch(actions.counter.set(counter))}
                isSaving={false}
                onSave={counter => dispatch(actions.counter.save(counter))}
                onCancel={console.log}
            />
        );
    }
};

const CurrentCounter = React.memo(CurrentCounter_);

export default React.memo(CounterPage);
