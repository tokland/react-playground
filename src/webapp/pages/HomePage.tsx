import React from "react";
import { useAppContext } from "../components/app/AppContext";
import { useAppState } from "../components/app/App";
import Button from "../components/Button";
import Session from "../components/Session";

const HomePage: React.FC = () => {
    const { actions } = useAppContext();
    const session = useAppState(state => state.session);
    const userLoggedIn = session.type === "loggedIn";

    return (
        <>
            <Session />
            {userLoggedIn && (
                <>
                    <CounterButton index="1" onClick={actions.routes.loadCounterAndGoToPage} />
                    <CounterButton index="2" onClick={actions.routes.loadCounterAndGoToPage} />
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
    const username = session.type === "loggedIn" ? session.username : undefined;
    const counterId = `${username}-${index}`;
    const clickWithId = React.useCallback(() => onClick(counterId), [onClick, counterId]);

    return <Button onClick={clickWithId} text={`Counter ${counterId}`} />;
};

export default React.memo(HomePage);
