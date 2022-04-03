import React from "react";
import { AppState, useAppState } from "./useAppState";

export const Counter: React.FC<{ id: "counter1" | "counter2" }> = props => {
    const { id } = props;
    const { state, setState } = useAppState();
    console.log("render-counter", props.id);

    const increment = React.useCallback(() => {
        setState(
            (prevState): AppState => ({
                ...prevState,
                [id]: { value: prevState[id].value + 1 },
            })
        );
    }, [id, setState]);

    return (
        <div>
            <span>value = {state[props.id].value}</span>
            <button onClick={increment}>INC</button>
        </div>
    );
};
