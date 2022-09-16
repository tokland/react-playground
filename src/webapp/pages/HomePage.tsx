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
    const session = useAppStateOrFail(state => state.loggedSession);
    const id = `${session.username}-${index}`;
    const clickWithId = React.useCallback(() => onClick(id), [onClick, id]);
    const value = useAppState(state => state.currentCounter?.counter?.value);
    const text = _.compact(["Counter", id, value ? ` (${value})` : null]).join(" ");

    return <Button onClick={clickWithId} text={text} />;
};

export default React.memo(HomePage);
