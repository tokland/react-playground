import React from "react";
import { useAppState } from "./app/App";
import { useAppContext } from "./app/AppContext";
import { useStateWithEventSetter } from "../hooks/useStateWithEventSetter";

const SessionComponent: React.FC = () => {
    const { actions } = useAppContext();
    const session = useAppState(state => state.session);
    const [username, setUsernameFromEv] = useStateWithEventSetter("");

    const login = React.useCallback<React.FormEventHandler<HTMLFormElement>>(
        ev => {
            ev.preventDefault();
            actions.session.login(username);
        },
        [actions, username]
    );

    return (
        <div>
            {session.type === "loggedIn" ? (
                <>
                    <span>Logged in as {session.username}</span>&nbsp;
                    <button onClick={actions.session.logout}>Logout</button>
                </>
            ) : (
                <form onSubmit={login}>
                    <input onChange={setUsernameFromEv} placeholder="Username"></input>
                    <button type="submit">Login</button>
                </form>
            )}
        </div>
    );
};

export default React.memo(SessionComponent);
