import React from "react";
import { Action } from "../AppActions";
import { RunGenerator, runAction } from "../components/app/App";

type Cancel = () => void;

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
            const generator = runAction(action);
            setGenerator({ value: generator });
        },
        [getAction]
    );

    const cancel = React.useCallback(() => {
        cancelRef.current?.();
    }, []);

    React.useEffect(() => {
        if (!generator) return;

        const result = generator.value.next();

        if (result.done) {
            setGenerator(undefined);
            return () => {};
        } else {
            const cancelEffect = result.value.run(
                _effectResult => {
                    setGenerator({ value: generator.value });
                },
                err => {
                    setGenerator(undefined);
                    console.error(err);
                }
            );

            cancelRef.current = () => {
                if (isMounted()) setGenerator(undefined);
                cancelEffect();
            };

            return cancelOnComponentUnmount ? cancelEffect : undefined;
        }
    }, [generator, getAction, cancelOnComponentUnmount, isMounted]);

    const isRunning = generator !== undefined;

    return [runEffect, isRunning, cancel];
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
