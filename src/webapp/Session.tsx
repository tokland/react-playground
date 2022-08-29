import React from "react";
import { useAppState } from "../domain/entities/AppReducer";
import { useAppContext } from "./AppContext";

function SessionComponent() {
    const { store } = useAppContext();
    const session = useAppState(state => state.session);
    // TODO: can be written with useCallback? store.logout
    const logout = React.useCallback(() => {
        return store.logout();
    }, [store]);

    return (
        <div>
            {session.type === "logged" ? (
                <>
                    <span>Logged {session.username}</span>&nbsp;
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <span>Not logged in</span>
            )}
        </div>
    );
}

export const Session = React.memo(SessionComponent);
