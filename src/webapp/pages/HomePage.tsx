import React from "react";
import { appReducer, useAppDispatch } from "../../domain/entities/AppReducer";
import { Id } from "../../domain/entities/Base";
import { useAppContext } from "../AppContext";

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { compositionRoot } = useAppContext();

    const goToCounter = React.useCallback(
        async (id: Id) => {
            const counter = await compositionRoot.counters.get(id);
            dispatch(appReducer.setPage({ type: "counter", counter }));
        },
        [dispatch, compositionRoot]
    );

    return (
        <>
            <button onClick={() => goToCounter("1")}>Counter 1</button>
        </>
    );
};

export default HomePage;
