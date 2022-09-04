import React from "react";
import { CancellablePromise } from "real-cancellable-promise";
import { useAppContext } from "../AppContext";
import { useAppState } from "../App";
import Button from "../components/Button";
import Counter from "../Counter";
import Session from "../Session";

const CounterPage: React.FC = () => {
    const { actions } = useAppContext();

    return (
        <>
            <Session />
            <CounterFromState />
            <Button onClick={actions.routes.goToHome} text="Back to Home page" />
        </>
    );
};

type Cancel = () => void;

function useCancellableEffect<T>(
    action: () => CancellablePromise<T>,
    options: { cancelOnComponentUnmount?: boolean } = {}
): [() => void, boolean, Cancel] {
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

        const promise = action().finally(() => {
            if (isMounted()) setActive(false);
        });
        cancelRef.current = promise.cancel;

        if (cancelOnComponentUnmount) return promise.cancel;
    }, [isActive, action, cancelOnComponentUnmount, isMounted]);

    return [run, isActive, cancel];
}

function useIsMounted() {
    const isMountedRef = React.useRef(true);
    const isMounted = React.useCallback(() => isMountedRef.current, []);

    React.useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return isMounted;
}

const CounterFromState: React.FC = () => {
    const { actions } = useAppContext();
    const counter = useAppState(state => state.counter);
    const [save, isSaving, cancelSave] = useCancellableEffect(actions.counter.save);

    if (!counter) return <div>Loading...</div>;

    return (
        <div>
            <Counter counter={counter} onChange={actions.counter.set} />

            <button onClick={save} disabled={isSaving}>
                SAVE
            </button>

            <button onClick={cancelSave} disabled={!isSaving}>
                CANCEL
            </button>
        </div>
    );
};

export default React.memo(CounterPage);
