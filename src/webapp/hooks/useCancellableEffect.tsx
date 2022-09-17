import React from "react";
import { CancellablePromise } from "real-cancellable-promise";

type Fn = () => void;

export interface Effect<T> {
    run(success: (data: T) => void, error: (err: string) => void): void;
    cancel: Fn;
}

function toEffect<T>(cPromise: CancellablePromise<T>): Effect<T> {
    return { run: cPromise.then, cancel: cPromise.cancel };
}

export function useCancellableEffect<Args extends any[]>(
    effect: (...args: Args) => CancellablePromise<unknown>,
    options: { cancelOnComponentUnmount?: boolean } = {}
): [(...args: Args) => void, boolean, Cancel] {
    const { cancelOnComponentUnmount = false } = options;
    const [args, setArgs] = React.useState<Args>();
    const isMounted = useIsMounted();
    const cancelRef = React.useRef<Cancel>();

    const run = React.useCallback((...args: Args) => {
        setArgs(args);
    }, []);

    const cancel = React.useCallback(() => {
        if (cancelRef.current) cancelRef.current();
    }, []);

    React.useEffect(() => {
        if (!args) return;

        const promise = effect(...args).finally(() => {
            if (isMounted()) setArgs(undefined);
        });
        cancelRef.current = promise.cancel;

        if (cancelOnComponentUnmount) return promise.cancel;
    }, [args, effect, cancelOnComponentUnmount, isMounted]);

    const isRunning = args !== undefined;

    return [run, isRunning, cancel];
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

type Cancel = () => void;
