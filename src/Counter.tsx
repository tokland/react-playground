import React from "react";
import { appContext } from "./App";
import { app, AppState, initialAppState } from "./AppReducer";
import { useStateSelector } from "./StateContext";
import { Action } from "./StateReducer";

export const Counter: React.FC<{ counterId: "counter1" | "counter2" }> = React.memo(props => {
    const { counterId } = props;
    const [counter, setState] = useStateSelector(appContext, state => state[counterId]);

    /*
    const increment = React.useCallback(() => {
        setState(prev => ({ ...prev, [counterId]: { value: prev[counterId].value + 1 } }));
    }, [counterId, setState]);
    */

    const dispatch = React.useCallback(
        (action: Action<AppState>) => {
            setState(prev => action.update(prev));
        },
        [setState]
    );

    const increment = React.useCallback(() => {
        dispatch(app[counterId].increment());
    }, [counterId]);

    const decrement = React.useCallback(() => {
        setState(prev => ({ ...prev, [counterId]: { value: prev[counterId].value - 1 } }));
    }, [counterId, setState]);

    const resetAll = React.useCallback(() => {
        setState(_prev => initialAppState);
    }, [setState]);

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
