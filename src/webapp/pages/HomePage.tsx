import React from "react";
import { appReducer, userAppDispatch } from "../../domain/entities/AppStore";
import { Id } from "../../domain/entities/Base";
import { useAppContext } from "../AppContext";

const HomePage: React.FC = () => {
    const dispatch = userAppDispatch();
    const { compositionRoot } = useAppContext();

    const goToCounter = React.useCallback(
        async (id: Id) => {
            console.log("goTo", { id });
            // TODO: actions.setLoading(`counter-${id}`);
            const counter = await compositionRoot.counters.get(id);
            dispatch(appReducer.goTo({ type: "counter", counter }));
        },
        [dispatch, compositionRoot]
    );

    return (
        <>
            <button onClick={() => goToCounter("1")}>Counter 1</button>
            {/*<Link to={{ type: "counter", counter: { type: "loading", id: 1 } }} text="Counter 1" />*/}
        </>
    );
};

export default HomePage;
