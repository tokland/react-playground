import React from "react";
import { useAppContext } from "../AppContext";
import Link from "../components/Link";
import Counter from "../Counter";
import { Session } from "../Session";

const CounterPage: React.FC = () => {
    const { store } = useAppContext();

    return (
        <>
            <Session />
            <Link onClick={store.routes.goToHome} text="Back" />
            <Counter />
        </>
    );
};

export default CounterPage;
