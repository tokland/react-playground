import React from "react";
import { appReducer, useAppState, useAppDispatch } from "../domain/entities/AppReducer";

function SessionComponent() {
    const session = useAppState(state => state.session);
    const dispatch = useAppDispatch();
    const logout = React.useCallback(() => dispatch(appReducer.logout()), [dispatch]);

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
