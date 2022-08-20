import React from "react";
import Link from "../components/Link";
import { Counter } from "../Counter";
import { Session } from "../Session";

const CounterPage: React.FC = () => {
    return (
        <>
            <Session />
            <Counter />
            <Link to={{ type: "home" }} text="Back" />
        </>
    );
};

export default CounterPage;
