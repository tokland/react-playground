import React from "react";
import { useAppState } from "./AppStateHooks";
import { useAppContext } from "./AppContext";
import { useStateWithEventSetter } from "./hooks/useStateWithEventSetter";

const SessionComponent: React.FC = () => {
    const session = useAppState(state => state.session);
    const { store } = useAppContext();
    const [username, setUsernameFromEv] = useStateWithEventSetter("");
    const login = React.useCallback(() => store.session.login(username), [store, username]);

    return (
        <div>
            {session.type === "logged" ? (
                <>
                    <span>Logged in as: {session.username}</span>&nbsp;
                    <button onClick={store.session.logout}>Logout</button>
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
