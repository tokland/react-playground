import React from "react";

export function createContextState<State>(): StateContext<State> {
    return React.createContext<Store<State> | undefined>(undefined);
}

export function useContextStateProvider<State>(context: StateContext<State>, initialState: State) {
    const initialStateMemoized = useFirst(initialState);
    const store = React.useMemo(() => new Store(initialStateMemoized), [initialStateMemoized]);

    const ProviderComponent = React.useCallback<React.FC>(
        props => <context.Provider value={store}>{props.children}</context.Provider>,
        [context, store]
    );
    return ProviderComponent;
}

export function useContextState<State, SelectedState>(
    context: StateContext<State>,
    selector: (state: State) => SelectedState
): [SelectedState, SetState<State>] {
    const store = React.useContext(context);
    const rerender = useRerender();

    if (!store) throw new Error("State context not initialized");

    const selection = React.useMemo(() => {
        return selector(store.state);
    }, [selector, store.state]);

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

    const setState = React.useCallback(
        action => {
            const newState = action(store.state);
            store.setState(newState);
        },
        [store]
    );

    return [selection, setState];
}

type Updater<State> = (state: State) => State;

export type SetState<State> = (updater: Updater<State>) => void;

type StateContext<State> = React.Context<Store<State> | undefined>;

/* State store */

type Listener<State> = (newState: State) => void;

type Unsubscriber = () => void;

class Store<State> {
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

function useFirst<Value>(value: Value): Value {
    const ref = React.useRef(value);
    return ref.current;
}

function useLatestRef<Value>(value: Value): React.MutableRefObject<Value> {
    const ref = React.useRef(value);
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref;
}

function useRerender() {
    const setState = React.useState(0)[1];
    return React.useCallback(() => setState(n => n + 1), [setState]);
}
