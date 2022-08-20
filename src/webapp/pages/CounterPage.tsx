import React from "react";
import { useAppStore } from "../../domain/entities/AppStore";
import Link from "../components/Link";
import Counter from "../Counter";
import { Session } from "../Session";

const CounterPage: React.FC<{ id: number }> = props => {
    const [counter, actions] = useAppStore(state =>
        props.id === 1 ? state.counters.counter1 : state.counters.counter2
    );

    const counterActions = props.id === 1 ? actions.counters.counter1 : actions.counters.counter2;

    return (
        <>
            <Session />
            <Link to={{ type: "home" }} text="Back" />
            <Counter counter={counter} actions={counterActions} />
        </>
    );
};

export default CounterPage;
