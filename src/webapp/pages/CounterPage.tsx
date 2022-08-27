import React from "react";
import Link from "../components/Link";
import { Counter as CounterE } from "../../domain/entities/Counter";
import Counter from "../Counter";

const CounterPage: React.FC<{ counter: CounterE }> = () => {
    return (
        <>
            <Link to={{ type: "home" }} text="Back" />
            <Counter />
        </>
    );
};

export default CounterPage;
