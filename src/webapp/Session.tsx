import React from "react";
import { useAppState } from "../domain/entities/AppReducer";
import { useAppContext } from "./AppContext";

function SessionComponent() {
    const { store } = useAppContext();
    const session = useAppState(state => state.session);

    return (
        <div>
            {session.type === "logged" ? (
                <>
                    <span>Logged {session.username}</span>&nbsp;
                    <button onClick={store.session.logout}>Logout</button>
                </>
            ) : (
                <span>Not logged in</span>
            )}
        </div>
    );
}

export const Session = React.memo(SessionComponent);
