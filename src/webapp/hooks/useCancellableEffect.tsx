import React from "react";

type Cancel = () => void;

export function useCancellableEffect<Args extends any[]>(
    runEffect: (...args: Args) => Cancel,
    options: { cancelOnComponentUnmount?: boolean } = {}
): [(...args: Args) => void, Cancel] {
    const { cancelOnComponentUnmount = false } = options;
    const [args, setArgs] = useSafeState<Args>();
    const clearArgs = React.useCallback(() => setArgs(undefined), [setArgs]);
    const cancelRef = React.useRef<Cancel>(() => clearArgs());

    React.useEffect(() => {
        if (!args) return;

        const cancelEffect = runEffect(...args);

        cancelRef.current = () => {
            clearArgs();
            cancelEffect();
        };

        return cancelOnComponentUnmount ? cancelEffect : undefined;
    }, [args, runEffect, cancelOnComponentUnmount, clearArgs]);

    const run = React.useCallback((...args: Args) => setArgs(args), [setArgs]);
    const cancel = cancelRef.current;

    return [run, cancel];
}

function useSafeState<State>(initialState?: State | undefined) {
    const [state, setState] = React.useState(initialState);
    const isMounted = useIsMounted();
    const setStateIfMounted = React.useCallback(
        (newState: State | undefined) => {
            if (isMounted()) setState(newState);
        },
        [isMounted, setState]
    );

    return [state, setStateIfMounted] as const;
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
