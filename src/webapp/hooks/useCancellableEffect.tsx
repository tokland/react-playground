import React from "react";

type Cancel = () => void;

export interface Effect<Data> {
    run(success: (data: Data) => void, reject: (msg: string) => void): Cancel;
}

export function useCancellableEffect<Args extends any[]>(
    runEffect: (...args: Args) => Cancel,
    options: { cancelOnComponentUnmount?: boolean } = {}
): [(...args: Args) => void, Cancel] {
    const { cancelOnComponentUnmount = false } = options;
    const [args, setArgs] = React.useState<Args>();
    const isMounted = useIsMounted();
    const cancelRef = React.useRef<Cancel>(() => {});

    const run = React.useCallback((...args: Args) => {
        setArgs(args);
    }, []);

    const cancel = cancelRef.current;

    const clearArgs = React.useCallback(() => {
        if (isMounted()) setArgs(undefined);
    }, [isMounted, setArgs]);

    React.useEffect(() => {
        if (!args) return;

        const cancel = runEffect(...args);

        cancelRef.current = () => {
            clearArgs();
            cancel();
        };

        return cancelOnComponentUnmount ? cancel : undefined;
    }, [args, runEffect, cancelOnComponentUnmount, clearArgs]);

    return [run, cancel];
}

function useIsMounted() {
    const isMountedRef = React.useRef(true);
    const isMounted = React.useCallback(() => isMountedRef.current, []);

    React.useEffect(() => {
        return function cancel() {
            isMountedRef.current = false;
        };
    }, []);

    return isMounted;
}
