import React from "react";
import { ActionGenerator } from "../AppActions";
import { RunGenerator, runAction, EffectResult } from "../components/app/App";

type Cancel = () => void;

export function useCancellableEffect<Args extends any[]>(
    getAction: (...args: Args) => ActionGenerator,
    options: { cancelOnComponentUnmount?: boolean } = {}
): [(...args: Args) => void, Cancel, boolean] {
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
                return undefined;
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

        run();
    }, [state, getAction, cancelOnComponentUnmount, isMounted]);

    const isActive = state !== undefined;

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
