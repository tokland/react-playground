import React from "react";
import { useAppContext } from "../AppContext";
import { Session } from "../Session";

const HomePage: React.FC = () => {
    const { store } = useAppContext();

    return (
        <>
            <Session />
            <button onClick={() => store.routes.loadCounterAndSetPage("1")}>Counter 1</button>
            <button onClick={() => store.routes.loadCounterAndSetPage("2")}>Counter 2</button>
        </>
    );
};

export default HomePage;
