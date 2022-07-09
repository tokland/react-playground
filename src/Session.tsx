import React from "react";
import { useAppStore } from "./AppContext";

function SessionComponent() {
    const [session] = useAppStore(state => state.session);

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
