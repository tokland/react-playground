import React from "react";

export type Selector<State, SelectedState> = (state: State) => SelectedState;

export function useStoreState<State, SelectedState>(
    store: Store<State>,
    selector: Selector<State, SelectedState>
): SelectedState {
    const rerender = useRerender();
    const selection = React.useMemo(() => selector(store.state), [selector, store.state]);

    const selectionRef = useLatestRef(selection);
    const selectorRef = useLatestRef(selector);

    const stateTransition = React.useCallback<Listener<State>>(
        newState => {
            const prevSelection = selectionRef.current;
            const newSelection = selectorRef.current(newState);
            if (prevSelection !== newSelection) rerender();
        },
        [rerender, selectorRef, selectionRef]
    );

    React.useEffect(() => {
        return store.subscribe(stateTransition);
    }, [store, stateTransition]);

    return selection;
}

export function useStoreSetState<State>(store: Store<State>): SetState<State> {
    const setState = React.useCallback(
        async (action: ValueOrUpdater<State>) => {
            if (typeof action === "function") {
                const newState = await action(store.state);
                store.setState({ ...store.state, ...newState });
            } else {
                store.setState({ ...store.state, ...action });
            }
        },
        [store]
    );

    return setState;
}

type ValueOrUpdater<State> =
    | Partial<State>
    | ((state: State) => Partial<State> | Promise<Partial<State>>);

export type SetState<State> = (updater: ValueOrUpdater<State>) => void;

/* State store */

type Listener<State> = (newState: State) => void;

type Unsubscriber = () => void;

export class Store<State> {
    private listeners: Set<Listener<State>>;

    constructor(private _state: State) {
        this.listeners = new Set();
    }

    get state(): State {
        return this._state;
    }

    setState(newState: State): void {
        this._state = newState;
        this.listeners.forEach(listener => listener(newState));
    }

    subscribe(listener: Listener<State>): Unsubscriber {
        this.listeners.add(listener);
        return () => this.unsubscribe(listener);
    }

    unsubscribe(listener: Listener<State>): void {
        this.listeners.delete(listener);
    }
}

/* Generic hooks */

function useLatestRef<Value>(value: Value): React.MutableRefObject<Value> {
    const ref = React.useRef(value);
    React.useEffect(() => void (ref.current = value), [value]);
    return ref;
}

function useRerender() {
    const setState = React.useState(0)[1];
    return React.useCallback(() => setState(n => n + 1), [setState]);
}
