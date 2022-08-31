import React from "react";
import { useAppState } from "./AppStateHooks";
import { useAppContext } from "./AppContext";

function SessionComponent() {
    const { store } = useAppContext();
    const session = useAppState(state => state.session);

    const [username, setUsername] = React.useState("");

    const login = React.useCallback(() => {
        store.session.login(username);
    }, [username]);

    return (
        <div>
            {session.type === "logged" ? (
                <>
                    <span>Logged in as: {session.username}</span>&nbsp;
                    <button onClick={store.session.logout}>Logout</button>
                </>
            ) : (
                <>
                    <span>Username: </span>
                    <input onBlur={ev => setUsername(ev.currentTarget.value)}></input>
                    <button onClick={login}>Login</button>
                </>
            )}
        </div>
    );
}

type T1 = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const Session = React.memo(SessionComponent);
