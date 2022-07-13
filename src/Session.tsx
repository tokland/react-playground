import React from "react";
import { useAppStoreWithActions } from "./AppStore";

function SessionComponent() {
    const [session, actions] = useAppStoreWithActions(state => state.session);

    return (
        <div>
            <button onClick={actions.reset}>Reset</button>

            {session.type === "logged" ? (
                <span>Logged {session.username}</span>
            ) : (
                <span>Not logged in</span>
            )}
        </div>
    );
}

export const Session = React.memo(SessionComponent);
