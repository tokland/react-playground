import React from "react";
import { useAppContext } from "../AppContext";
import { useAppState } from "../AppStateHooks";
import { Session } from "../Session";

const HomePage: React.FC = () => {
    const { store } = useAppContext();
    const session = useAppState(state => state.session);

    const counterIds = React.useMemo(() => {
        const ids = ["1", "2", "3"];
        const username = session.type === "logged" ? session.username : undefined;
        return username ? ids.map(id => `${username}-${id}`) : [];
    }, [session]);

    return (
        <>
            <Session />

            {counterIds.map(id => (
                <CounterButton
                    key={id}
                    counterId={id}
                    onClick={store.routes.loadCounterAndSetPage}
                />
            ))}
        </>
    );
};

interface CounterButtonProps {
    onClick: (counterId: string) => void;
    counterId: string;
}

const CounterButton: React.FC<CounterButtonProps> = props => {
    const { onClick, counterId } = props;
    const clickWithId = React.useCallback(() => onClick(counterId), [onClick, counterId]);

    return <button onClick={clickWithId}>Counter {counterId}</button>;
};

export default HomePage;
