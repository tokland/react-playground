import React from "react";
import _ from "lodash";
import { Counter } from "./Counter";
import { AppState, AppStateProvider, useAppStateProvider } from "./useAppState";

const indexes = [1, 2, 3, 4];

const App = () => {
    const [number, setNumber] = React.useState(1);

    const add = React.useMemo(() => {
        return _.fromPairs(indexes.map(n => [n, () => setNumber(x => x + n)]));
    }, []);

    const initialAppState: AppState = {
        counter1: { value: 0 },
        counter2: { value: 10 },
    };
    const appStateProviderValue = useAppStateProvider(initialAppState);

    return (
        <AppStateProvider value={appStateProviderValue}>
            <Counter id="counter1" />
            <Counter id="counter2" />

            <div style={{ display: "none" }}>
                {indexes.map(index => (
                    <button key={index} onClick={add[index]}>
                        +{index}
                    </button>
                ))}

                <div>{number}</div>
            </div>
        </AppStateProvider>
    );
};

export default App;
