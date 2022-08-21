import React from "react";
import { AppState } from "../../domain/entities/AppState";
import { useAppActions, useAppState } from "../../domain/entities/AppStore";
import Link from "../components/Link";
import Counter from "../Counter";
import { Session } from "../Session";

const CounterPage: React.FC<{ id: number }> = props => {
    const mapper: Record<number, keyof AppState["counters"]> = { 1: "counter1", 2: "counter2" };
    const key = mapper[props.id] || "counter1";

    const counter = useAppState(state => state.counters[key]);
    const actions = useAppActions();
    const counterActions = actions.counters[key];

    return (
        <>
            <Session />
            <Link to={{ type: "home" }} text="Back" />
            <Counter counter={counter} actions={counterActions} />
        </>
    );
};

export default CounterPage;
