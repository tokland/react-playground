import React, { useContext } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { CompositionRoot } from "../compositionRoot";
import { AppState, Feedback } from "../domain/entities/AppState";
import { Async } from "../domain/entities/Async";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { buildReducer } from "../libs/reducer";
import { EffectResult } from "./components/app/App";

const state$ = buildReducer(AppState);

export type ActionCommand =
    | { type: "getState" }
    | { type: "setStateFn"; fn: (state: AppState) => AppState }
    | { type: "effect"; value$: Async<unknown> };

export type ActionGenerator = Generator<ActionCommand, void, unknown>;

export type BaseActionGenerator<T> = Generator<ActionCommand, T, T>;

interface Options {
    compositionRoot: CompositionRoot;
}

class BaseActions {
    protected compositionRoot: CompositionRoot;

    constructor(protected options: Options) {
        this.compositionRoot = options.compositionRoot;
    }

    setFrom<Args extends any[]>(fn: (...args: Args) => (state: AppState) => AppState) {
        return (...args: Args) => this.set(state => fn(...args)(state));
    }

    protected *get(): BaseActionGenerator<AppState> {
        return yield { type: "getState" };
    }

    protected *set(setter: (state: AppState) => AppState): BaseActionGenerator<void> {
        yield { type: "setStateFn", fn: setter };
    }

    protected *effect<T>(value$: Async<T>): BaseActionGenerator<EffectResult<T>> {
        return yield { type: "effect", value$ };
    }

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

    protected *effectWithFeedback<T>(
        value$: Async<T>
    ): Generator<ActionCommand, EffectResult<T>, any> {
        const res = yield* this.effect(value$);
        yield* this.setFeedbackFromEffectResult(res);
        return res;
    }

    protected *feedback(value: Feedback): BaseActionGenerator<void> {
        yield* this.set(state$.setFeedback(value));
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

    *save(counter: Counter) {
        yield* this.set(state$.setCounter(counter, { isUpdating: true }));
        const res = yield* this.effect(this.compositionRoot.counters.save(counter));
        yield* this.setFeedbackFromEffectResult(res, { successMessage: "saved" });
        yield* this.set(state$.setCounter(counter, { isUpdating: false }));
    }

    *loadCounterAndSetAsCurrentPage(id: Id) {
        yield* this.set(state$.goToCounter(id));
        yield* this.load(id);
    }

    private *load(id: Id) {
        const state = yield* this.get();
        const status = state.counters.get(id)?.status;
        if (status === "loading" || status === "loaded") return;

        yield* this.set(state$.setCounterAsLoading(id));
        const res = yield* this.effectWithFeedback(this.compositionRoot.counters.get(id));
        if (res.type === "success") yield* this.set(state$.setCounter(res.value));
    }
}

export class AppActions extends BaseActions {
    session = new SessionActions(this.options);
    routes = new RouterActions(this.options);
    counter = new CounterActions(this.options);
}

type State = { x: number };

type Store = { get: () => State; set: (state: State) => void };

class Actions {
    constructor(private store: Store, private _compositionRoot: CompositionRoot) {}

    private get state() {
        return this.store.get();
    }

    private set(state: State) {
        this.store.set(state);
    }

    add(n: number) {
        this.set({ ...this.state, x: this.state.x + n });
    }
}

const initialState: State = { x: 1 };

type ZustandStore = StoreApi<{ state: State; actions: Actions }>;

export function getStore(compositionRoot: CompositionRoot) {
    return createStore<{ state: State; actions: Actions }>((set, get) => ({
        state: initialState,
        actions: new Actions(
            {
                set: state => set({ state }),
                get: () => get().state,
            },
            compositionRoot
        ),
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
