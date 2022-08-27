import React from "react";
import Link from "../components/Link";
import Counter from "../Counter";
import { Session } from "../Session";
import { Counter as CounterE } from "../../domain/entities/Counter";
import { appReducer, userAppDispatch } from "../../domain/entities/AppStore";

const CounterPage: React.FC<{ counter: CounterE }> = props => {
    const { counter } = props;
    const dispatch = userAppDispatch();

    // useActionsFromReducer(dispatch, appReducer.counter)
    const actions = React.useMemo(() => {
        // getActionsFromReducer(dispatch, appReducer.counter)
        return {
            add: (n: number) => dispatch(appReducer.counter.add(n)),
        };
    }, [dispatch]);

    return (
        <>
            <Session />
            <Link to={{ type: "home" }} text="Back" />
            <Counter counter={counter} actions={actions} />
        </>
    );
};

export default CounterPage;
