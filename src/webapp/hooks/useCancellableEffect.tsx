import React from "react";
import { Action } from "../AppActions";
import { dispatch } from "../components/app/App";

type Cancel = () => void;

export interface Effect<Data> {
    run(success: (data: Data) => void, reject: (msg: string) => void): Cancel;
}

export function useCancellableEffect<Args extends any[]>(
    getEffect: (...args: Args) => Action,
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

    const clearArgs = React.useCallback(() => {
        if (isMounted()) setArgs(undefined);
    }, [isMounted, setArgs]);

    React.useEffect(() => {
        if (!args) return;

        const action = getEffect(...args);

        dispatch(action).then(
            _data => clearArgs(),
            _err => clearArgs()
        );

        const cancel = () => console.log("TODO:cancel");

        /* const cancel = getEffect(...args).run(_data => clearArgs(), _err => clearArgs()); */

        cancelRef.current = () => {
            clearArgs();
            cancel();
        };

        return cancelOnComponentUnmount ? cancel : undefined;
    }, [args, getEffect, cancelOnComponentUnmount, clearArgs]);

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
