import React from "react";
import { useAppState } from "./app/App";
import { useAppContext } from "./app/AppContext";
import { useStateWithEventSetter } from "../hooks/useStateWithEventSetter";

const SessionComponent: React.FC = () => {
    const session = useAppState(state => state.session);
    const { actions } = useAppContext();
    const [username, setUsernameFromEv] = useStateWithEventSetter("");
    const login = React.useCallback(() => actions.session.login(username), [actions, username]);

    return (
        <div>
            {session.type === "loggedIn" ? (
                <>
                    <span>Logged in as: {session.username}</span>&nbsp;
                    <button onClick={actions.session.logout}>Logout</button>
                </>
            ) : (
                <>
                    <input onBlur={setUsernameFromEv} placeholder="Username"></input>
                    <button onClick={login}>Login</button>
                </>
            )}
        </div>
    );
};

export default React.memo(SessionComponent);
