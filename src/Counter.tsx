import React from "react";
import { appContext } from "./App";
import { app } from "./AppReducer";
import { useContextState } from "./StateContext";

export const Counter: React.FC<{ counterId: "counter1" | "counter2" }> = React.memo(props => {
    const { counterId } = props;
    const [counter, dispatch] = useContextState(appContext, state => state[counterId]);

    const increment = React.useCallback(() => {
        dispatch(app[counterId].increment());
    }, [counterId, dispatch]);

    const decrement = React.useCallback(() => {
        dispatch(app[counterId].add(-1));
    }, [counterId, dispatch]);

    const resetAll = React.useCallback(() => {
        dispatch(app.reset());
    }, [dispatch]);

    console.debug("Counter:render", props.counterId);

    return (
        <div>
            <span>value = {counter.value}</span>
            <button onClick={decrement}>-1</button>
            <button onClick={increment}>+1</button>
            <button onClick={resetAll}>RESET ALL</button>
        </div>
    );
});

Counter.displayName = "Counter";
