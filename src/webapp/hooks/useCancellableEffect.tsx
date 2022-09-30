import React from "react";
import { Action } from "../AppActions";
import { RunGenerator, runGenerator } from "../components/app/App";

type Cancel = () => void;

export interface Effect<Data> {
    run(success: (data: Data) => void, reject: (msg: string) => void): Cancel;
}

export function useCancellableEffect<Args extends any[]>(
    getAction: (...args: Args) => Action,
    options: { cancelOnComponentUnmount?: boolean } = {}
): [(...args: Args) => void, boolean, Cancel] {
    const { cancelOnComponentUnmount = false } = options;
    const isMounted = useIsMounted();
    const cancelRef = React.useRef<Cancel>();
    const [generator, setGenerator] = React.useState<{ value: RunGenerator }>();

    const runEffect = React.useCallback(
        (...args: Args) => {
            const action = getAction(...args);
            const generator = runGenerator(action);
            setGenerator({ value: generator });
        },
        [getAction]
    );

    const cancel = React.useCallback(() => {
        cancelRef.current?.();
    }, []);

    const clearGenerator = React.useCallback(() => {
        if (isMounted()) setGenerator(undefined);
    }, [isMounted]);

    React.useEffect(() => {
        if (!generator) return;

        const result = generator.value.next();

        while (!result.done) {
            const cancel = result.value.run(
                _effectResult => {
                    setGenerator({ value: generator.value });
                },
                err => {
                    console.error(err);
                }
            );

            cancelRef.current = () => {
                clearGenerator();
                cancel();
            };

            return cancelOnComponentUnmount ? cancel : undefined;
        }

        setGenerator(undefined);

        return () => {};
    }, [generator, getAction, cancelOnComponentUnmount, clearGenerator]);

    const isRunning = generator !== undefined;

    return [runEffect, isRunning, cancel];
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
