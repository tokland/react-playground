import React, { ReactComponentElement } from "react";
import { useAppContext } from "../AppContext";
import { Session } from "../Session";

const HomePage: React.FC = () => {
    const { store } = useAppContext();

    return (
        <>
            <Session />

            {ids.map(id => (
                <CounterButton
                    key={id}
                    onClick={store.routes.loadCounterAndSetPage}
                    counterId={id}
                />
            ))}
        </>
    );
};

const ids = ["1", "2", "3"];

const CounterButton: React.FC<{
    onClick: (counterId: string) => void;
    counterId: string;
}> = props => {
    const { onClick, counterId } = props;
    const clickWithId = React.useCallback(() => onClick(counterId), [counterId]);

    return <button onClick={clickWithId}>Counter {counterId}</button>;
};

export default HomePage;
