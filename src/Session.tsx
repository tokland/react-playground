import React from "react";
import { useAppStore } from "./AppStore";

function SessionComponent() {
    const [session, actions] = useAppStore(state => state.session);

    return (
        <div>
            <button onClick={actions.reset}>Reset</button>
            {session.type === "logged" && <span>Logged {session.username}</span>}
        </div>
    );
}

/**
 * @expect [2, 4] toEqual 1
 * @expect [2, 4] toEqual 6
 */

export function sum(a: number, b: number) {
    return a + b;
}

export const Session = React.memo(SessionComponent);
