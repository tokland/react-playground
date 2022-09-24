import React from "react";
import { actions, useAppState, useAppStateOrFail } from "../components/app/App";
import Button from "../components/Button";
import Session from "../components/Session";

const HomePage: React.FC = () => {
    const session = useAppState(state => state.session);
    const userLoggedIn = session.type === "loggedIn";

    return (
        <>
            <Session />
            {userLoggedIn && (
                <>
                    <CounterButton index={1} onClick={actions.routes.goToCounter} />
                    <CounterButton index={2} onClick={actions.routes.goToCounter} />
                </>
            )}
        </>
    );
};

interface CounterButtonProps {
    onClick: (counterId: string) => void;
    index: number;
}

const CounterButton: React.FC<CounterButtonProps> = props => {
    const { onClick, index } = props;
    const id = useAppStateOrFail(state => state.counterIdFromIndex(index));
    const clickWithId = React.useCallback(() => onClick(id), [onClick, id]);
    const loader = useAppState(state => state.counters.get(id));
    const counter = loader?.status === "loaded" ? loader.value : undefined;
    const text = ["Counter", id, counter ? ` (${counter.value})` : null].filter(Boolean).join(" ");

    return <Button onClick={clickWithId} text={text} />;
};

export default React.memo(HomePage);
