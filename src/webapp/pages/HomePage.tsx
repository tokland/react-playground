import React from "react";
import _ from "lodash";
import { useAppContext } from "../components/app/AppContext";
import { useAppState, useAppStateOrFail } from "../components/app/App";
import Button from "../components/Button";
import Session from "../components/Session";

const HomePage: React.FC = () => {
    const { actions } = useAppContext();
    const session = useAppState(state => state.session);
    const userLoggedIn = session.type === "loggedIn";
    console.log({ session });

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
    const loader = useAppState(state => state.counters[id]);
    const counter = loader?.status === "loaded" ? loader.value : undefined;
    const text = _.compact(["Counter", id, counter ? ` (${counter.value})` : null]).join(" ");

    return <Button onClick={clickWithId} text={text} />;
};

export default React.memo(HomePage);
