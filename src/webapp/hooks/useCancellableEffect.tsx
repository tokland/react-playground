import React from "react";
import { Action } from "../AppActions";
import { RunGenerator, runAction, EffectResult } from "../components/app/App";

type Cancel = () => void;

export function useCancellableEffect<Args extends any[]>(
    getAction: (...args: Args) => Action,
    options: { cancelOnComponentUnmount?: boolean } = {}
): [(...args: Args) => void, boolean, Cancel] {
    const { cancelOnComponentUnmount = false } = options;
    const isMounted = useIsMounted();
    const cancelRef = React.useRef<Cancel>();
    const [state, setGenerator] = React.useState<{
        generator: RunGenerator;
        value: EffectResult<unknown> | undefined;
    }>();

    const runEffect = React.useCallback(
        (...args: Args) => {
            const action = getAction(...args);
            const generator = runAction(action);
            setGenerator({ generator: generator, value: undefined });
        },
        [getAction]
    );

    const cancel = React.useCallback(() => {
        cancelRef.current?.();
    }, []);

    React.useEffect(() => {
        function run() {
            if (!state) return;

            const result = state.generator.next(state.value);

            if (result.done) {
                setGenerator(undefined);
                return () => {};
            } else {
                const cancelEffect = result.value.run(
                    value => setGenerator({ ...state, value: { type: "success", value } }),
                    error => setGenerator({ ...state, value: { type: "error", error } })
                );

                cancelRef.current = () => {
                    if (isMounted()) setGenerator(undefined);
                    cancelEffect();
                    setGenerator({ ...state, value: { type: "cancelled" } });
                };

                return cancelOnComponentUnmount ? cancelEffect : undefined;
            }
        }

        try {
            run();
        } catch {
            setGenerator(undefined);
        }
    }, [state, getAction, cancelOnComponentUnmount, isMounted]);

    const isRunning = state !== undefined;

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
