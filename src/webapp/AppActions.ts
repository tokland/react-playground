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
    protected compositionRoot: CompositionRoot;

    constructor(protected options: Options) {
        this.compositionRoot = options.compositionRoot;
    }

    setFrom<Args extends any[]>(fn: (...args: Args) => (state: AppState) => AppState) {
        return (...args: Args) => this.set(state => fn(...args)(state));
    }

    protected get() {
        return this.options.store.get();
    }

    protected set(setter: (state: AppState) => AppState) {
        const newState = setter(this.get());
        console.log({ newState });
        return this.options.store.set(newState);
    }

    /*
    protected *setFeedbackFromEffectResult(
        res: EffectResult<unknown>,
        options?: { successMessage: string }
    ) {
        switch (res.type) {
            case "success":
                if (options?.successMessage)
                    yield* this.feedback({ success: { message: options?.successMessage } });
                break;
            case "error":
                yield* this.feedback({ error: { message: res.error.message } });
                break;
            case "cancelled":
                break;
        }
    }
    */

    protected effectWithFeedback<T>(value$: Async<T>) {
        return value$.run(
            () => {},
            () => {}
        );
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
        return this.effectWithFeedback(this.compositionRoot.counters.save(counter));
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

        return this.compositionRoot.counters.get(id).run(
            counter => this.set(state$.setCounter(counter)),
            _err => {}
        );
    }
}

export class AppActions extends BaseActions {
    session = new SessionActions(this.options);
    routes = new RouterActions(this.options);
    counter = new CounterActions(this.options);
}

type Store = { get(): State; set(state: State): void };

type State = AppState;
type Actions = AppActions;

type ZustandStore = StoreApi<{ state: State; actions: Actions }>;

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

const StoreContext = React.createContext<ZustandStore | null>(null);

export const StoreWrapper = StoreContext.Provider;

export function useStoreState<S>(selector: (state: State) => S) {
    const store = useContext(StoreContext)!;
    return useStore(store, obj => selector(obj.state));
}

export function useActions(): Actions {
    const store = useContext(StoreContext)!;
    return useStore(store).actions;
}
