import React from "react";
import { useAppActions } from "../../domain/entities/AppStore";
import { Counter } from "../../domain/entities/Counter";
import { Session } from "../Session";

async function getCounterByIdUseCase(id: number): Promise<Counter> {
    return { id, value: id };
}

const HomePage: React.FC = () => {
    const actions = useAppActions();

    const goToCounter = React.useCallback(
        async (id: number) => {
            console.log("goTo", { id });
            // TODO: actions.setLoading(`counter-${id}`);
            const counter = await getCounterByIdUseCase(id);
            actions.goTo({ type: "counter", counter });
        },
        [actions]
    );

    return (
        <>
            <Session />
            <button onClick={() => goToCounter(1)}>Counter 1</button>
            {/*<Link to={{ type: "counter", counter: { type: "loading", id: 1 } }} text="Counter 1" />*/}
        </>
    );
};

export default HomePage;
