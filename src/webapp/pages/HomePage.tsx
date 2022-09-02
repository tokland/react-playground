import React from "react";
import { useAppContext } from "../AppContext";
import { useAppState } from "../AppStateHooks";
import { Session } from "../Session";

const HomePage: React.FC = () => {
    const { store } = useAppContext();
    const session = useAppState(state => state.session);
    const userLoggedIn = session.type === "logged";

    return (
        <>
            <Session />
            {userLoggedIn && (
                <>
                    <CounterButton index="1" onClick={store.routes.loadCounterAndSetPage} />
                    <CounterButton index="2" onClick={store.routes.loadCounterAndSetPage} />
                </>
            )}
        </>
    );
};

interface CounterButtonProps {
    onClick: (counterId: string) => void;
    index: string;
}

const CounterButton: React.FC<CounterButtonProps> = props => {
    const { onClick, index } = props;
    const session = useAppState(state => state.session);
    const username = session.type === "logged" ? session.username : undefined;
    const counterId = `${username}-${index}`;
    const clickWithId = React.useCallback(() => onClick(counterId), [onClick, counterId]);

    return <button onClick={clickWithId}>Counter {counterId}</button>;
};

export default HomePage;
