import { CompositionRoot } from "../compositionRoot";
import { AppState } from "../domain/entities/AppState";
import { Async } from "../domain/entities/Async";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";

interface Options {
    compositionRoot: CompositionRoot;
}

class BaseActions {
    protected compositionRoot: CompositionRoot;

    constructor(protected options: Options) {
        this.compositionRoot = options.compositionRoot;
    }

    protected *getState(): Generator<ActionYield, AppState, AppState> {
        return yield { type: "getState" };
    }

    protected *set(setter: (state: AppState) => AppState): Generator<ActionYield, void, void> {
        yield { type: "setStateFn", fn: setter };
    }

    protected *effect<T>(value$: Async<T>): Generator<ActionYield, T, T> {
        return yield { type: "effect", value$ };
    }
}

export type ActionYield =
    | { type: "getState" }
    | { type: "setStateFn"; fn: (state: AppState) => AppState }
    | { type: "effect"; value$: Async<unknown> };

export type Action = Generator<ActionYield, void, any>;

class SessionActions extends BaseActions {
    login = (username: string) => this.set(state => state.login(username));
    logout = () => this.set(state => state.logout());
}

class RouterActions extends BaseActions {
    goToHome = () => this.set(state => state.goToHome());
}

class CounterActions extends BaseActions {
    setCounter(counter: Counter) {
        return this.set(state => state.setCounter(counter));
    }

    *load(id: Id) {
        const state = yield* this.getState();
        const status = state.counters.get(id)?.status;

        if (status === "loading" || status === "loaded") return;

        yield* this.set(state => state.setCounterAsLoading(id));
        const counter = yield* this.effect(this.compositionRoot.counters.get(id));
        yield* this.set(state => state.setCounter(counter));
    }

    *save(counter: Counter) {
        yield* this.set(state => state.setCounter(counter, { isUpdating: true }));
        yield* this.effect(this.compositionRoot.counters.save(counter));
        yield* this.set(state => state.setCounter(counter));
    }

    *loadCounterAndSetAsCurrentPage(id: Id) {
        yield* this.set(state => state.goToCounter(id));
        yield* this.load(id);
    }
}

export class AppActions extends BaseActions {
    session = new SessionActions(this.options);
    routes = new RouterActions(this.options);
    counter = new CounterActions(this.options);
}
