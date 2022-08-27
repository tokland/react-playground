import React from "react";
import Link from "../components/Link";
import Counter from "../Counter";
import { Counter as CounterE, counterReducer } from "../../domain/entities/Counter";
import { appReducer, userAppDispatch } from "../../domain/entities/AppStore";
import { useAppContext } from "../AppContext";

const CounterPage: React.FC<{ counter: CounterE }> = props => {
    const { counter } = props;
    const { compositionRoot } = useAppContext();
    const dispatch = userAppDispatch();

    // useActionsFromReducer(dispatch, appReducer.counter)
    const actions = React.useMemo(() => {
        // getActionsFromReducer(dispatch, appReducer.counter)
        return {
            add: async (n: number) => {
                const counterUpdated = counterReducer.add(n)(counter);
                await compositionRoot.counters.save(counterUpdated);
                dispatch(appReducer.counter.set(counterUpdated));
                // dispatch(appReducer.counter.set(counterUpdated)).then(state => compositionRoot.counters.save(state.counter))
            },
        };
    }, [dispatch, counter, compositionRoot]);

    return (
        <>
            <Link to={{ type: "home" }} text="Back" />
            <Counter counter={counter} actions={actions} />
        </>
    );
};

export default CounterPage;
