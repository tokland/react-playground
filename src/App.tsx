import React from "react";
import { Counter } from "./Counter";
import { Session } from "./Session";

const App: React.FC = () => {
    return (
        <>
            <Session />
            <Counter />
        </>
    );
};

export default App;
