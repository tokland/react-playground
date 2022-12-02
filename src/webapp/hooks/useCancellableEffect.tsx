import React from "react";

type Cancel = () => void;

export function useCancellableEffect<Args extends any[]>(
    runEffect: (...args: Args) => Cancel,
    options: { cancelOnComponentUnmount?: boolean } = {}
): [() => Cancel, Cancel, boolean] {
    const isActive = false;
    const cancel = React.useCallback(() => {
        console.log("TODO-cancel");
    }, []);

    return [runEffect, cancel, isActive];
}

function useIsMounted() {
    const isMountedRef = React.useRef(false);
    const isMounted = React.useCallback(() => isMountedRef.current, []);

    React.useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return isMounted;
}
