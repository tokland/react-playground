import React from "react";
import Link from "../components/Link";
import Counter from "../Counter";
import { Session } from "../Session";
import { Counter as CounterE, counterReducer } from "../../domain/entities/Counter";
import { useAppSetState } from "../../domain/entities/AppStore";

const CounterPage: React.FC<{ counter: CounterE }> = props => {
    const { counter } = props;
    const setAppState = useAppSetState();

    const actions = React.useMemo(() => {
        return {
            add: (n: number) => {
                setAppState(state =>
                    state.page.type === "counter"
                        ? {
                              ...state,
                              page: {
                                  type: "counter",
                                  counter: counterReducer.actions.add(n)(state.page.counter),
                              },
                          }
                        : state
                );
            },
        };
    }, [setAppState]);

    return (
        <>
            <Session />
            <Link to={{ type: "home" }} text="Back" />
            <Counter counter={counter} actions={actions} />
        </>
    );
};

export default CounterPage;
