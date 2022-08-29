import React from "react";
import { useAppContext } from "../AppContext";
import { Session } from "../Session";

const HomePage: React.FC = () => {
    const { store } = useAppContext();

    return (
        <>
            <Session />
            <button onClick={() => store.goToCounter("1")}>Counter 1</button>
        </>
    );
};

export default HomePage;
