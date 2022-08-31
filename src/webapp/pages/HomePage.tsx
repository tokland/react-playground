import React from "react";
import { useAppContext } from "../AppContext";
import { useAppState } from "../AppStateHooks";
import { Session } from "../Session";

const HomePage: React.FC = () => {
    const { store } = useAppContext();
    const session = useAppState(state => state.session);

    const counterIds = React.useMemo(() => {
        const username = session.type === "logged" ? session.username : undefined;
        return username ? ids.map(id => `${username}-${id}`) : [];
    }, [session]);

    return (
        <>
            <Session />

            {counterIds.map(id => (
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
    const clickWithId = React.useCallback(() => onClick(counterId), [onClick, counterId]);

    return <button onClick={clickWithId}>Counter {counterId}</button>;
};

export default HomePage;
