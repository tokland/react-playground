import React from "react";
import _ from "lodash";
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
                    <CounterButton index="1" onClick={actions.routes.goToCounter} />
                    <CounterButton index="2" onClick={actions.routes.goToCounter} />
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
    const id = `${username}-${index}`;
    const clickWithId = React.useCallback(() => onClick(id), [onClick, id]);

    const loader = useAppState(state => state.counters[id]);
    const value = loader?.status === "loaded" ? loader.value.value : undefined;
    const text = _.compact(["Counter", id, value ? ` (${value})` : null]).join(" ");

    return <Button onClick={clickWithId} text={text} />;
};

export default React.memo(HomePage);
