import React from "react";
import { useAppContext } from "./AppContext";

function SessionComponent() {
    const [session] = useAppContext(state => state.session);

    console.debug("Session:render", session);

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
