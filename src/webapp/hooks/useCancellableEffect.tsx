import React from "react";
import { CancellablePromise } from "real-cancellable-promise";

export function useCancellableEffect<T>(
    effect: () => CancellablePromise<T>,
    options: { cancelOnComponentUnmount?: boolean } = {}
): [Callback, boolean, Cancel] {
    const { cancelOnComponentUnmount = false } = options;
    const [isActive, setActive] = React.useState(false);
    const isMounted = useIsMounted();
    const cancelRef = React.useRef<Cancel>();

    const run = React.useCallback(() => {
        setActive(true);
    }, []);

    const cancel = React.useCallback(() => {
        if (cancelRef.current) cancelRef.current();
    }, []);

    React.useEffect(() => {
        if (!isActive) return;

        const promise = effect().finally(() => {
            if (isMounted()) setActive(false);
        });
        cancelRef.current = promise.cancel;

        if (cancelOnComponentUnmount) return promise.cancel;
    }, [isActive, effect, cancelOnComponentUnmount, isMounted]);

    return [run, isActive, cancel];
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

type Callback = () => void;
