import React, { useContext } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { CompositionRoot } from "../compositionRoot";
import { AppState, Feedback } from "../domain/entities/AppState";
import { Async } from "../domain/entities/Async";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { buildReducer } from "../libs/reducer";

const state$ = buildReducer(AppState);

interface Options {
    compositionRoot: CompositionRoot;
    store: Store;
}

class BaseActions {
    private store: Store;
    protected compositionRoot: CompositionRoot;

    constructor(protected options: Options) {
        this.compositionRoot = options.compositionRoot;
        this.store = options.store;
    }

    setFrom<Args extends any[]>(fn: (...args: Args) => (state: AppState) => AppState) {
        return (...args: Args) => this.set(state => fn(...args)(state));
    }

    protected get() {
        return this.store.get();
    }

    protected set(setter: (state: AppState) => AppState) {
        const newState = setter(this.get());
        return this.store.set(newState);
    }

    protected runEffectWithFeedback<T>(value$: Async<T>, onSuccess: (value: T) => void) {
        return value$.run(onSuccess, error => this.feedback({ error }));
    }

    protected feedback(value: Feedback) {
        return this.set(state$.setFeedback(value));
    }
}

class SessionActions extends BaseActions {
    login = this.setFrom(state$.login);
    logout = this.setFrom(state$.logout);
}

class RouterActions extends BaseActions {
    goToHome = this.setFrom(state$.goToHome);
}

class CounterActions extends BaseActions {
    setCounter = this.setFrom(state$.setCounter);

    save(counter: Counter) {
        this.set(state$.setCounter(counter, { isUpdating: true }));
        const save$ = this.compositionRoot.counters.save(counter);

        return this.runEffectWithFeedback(save$, counter => {
            return this.set(state$.setCounter(counter));
        });
    }

    loadCounterAndSetAsCurrentPage(id: Id) {
        this.set(state$.goToCounter(id));
        return this.load(id);
    }

    private load(id: Id) {
        const state = this.get();
        const status = state.counters.get(id)?.status;
        if (status === "loading" || status === "loaded") return;

        this.set(state$.setCounterAsLoading(id));

        return this.runEffectWithFeedback(this.compositionRoot.counters.get(id), counter => {
            return this.set(state$.setCounter(counter));
        });
    }
}

export class AppActions extends BaseActions {
    session = new SessionActions(this.options);
    routes = new RouterActions(this.options);
    counter = new CounterActions(this.options);
}

/* Store */

type Store = { get(): State; set(state: State): void };

type State = AppState;
type Actions = AppActions;

type ZustandStore = StoreApi<{ state: State; actions: Actions }>;

const StoreContext = React.createContext<ZustandStore | null>(null);

function useZustandStore() {
    const zstore = useContext(StoreContext);
    if (!zstore) throw new Error();
    return zstore;
}

export function getStore(compositionRoot: CompositionRoot, initialState: State) {
    return createStore<{ state: State; actions: Actions }>((set, get) => ({
        state: initialState,
        actions: new AppActions({
            compositionRoot,
            store: {
                set: state => set({ state }),
                get: () => get().state,
            },
        }),
    }));
}

export const StoreWrapper = StoreContext.Provider;

export function useAppState<SelectedState>(selector: (state: State) => SelectedState) {
    const zstore = useZustandStore();
    return useStore(zstore, obj => selector(obj.state));
}

export function useActions(): Actions {
    const zstore = useZustandStore();
    return useStore(zstore, obj => obj.actions);
}
