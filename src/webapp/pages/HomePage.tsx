import React from "react";
import { useAppContext } from "../AppContext";

const HomePage: React.FC = () => {
    const { store } = useAppContext();

    return (
        <>
            <button onClick={() => store.goToCounter("1")}>Counter 1</button>
        </>
    );
};

export default HomePage;
