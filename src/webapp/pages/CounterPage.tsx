import React from "react";
import Link from "../components/Link";
import Counter from "../Counter";

const CounterPage: React.FC = () => {
    return (
        <>
            <Link to={{ type: "home" }} text="Back" />
            <Counter />
        </>
    );
};

export default CounterPage;
