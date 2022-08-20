import React from "react";
import { useAppStore } from "../domain/entities/AppStore";

function SessionComponent() {
    const [session, _actions] = useAppStore(state => state.session);

    return (
        <div>
            {session.type === "logged" ? (
                <span>Logged {session.username}</span>
            ) : (
                <span>Not logged in</span>
            )}
        </div>
    );
}

export const Session = React.memo(SessionComponent);
