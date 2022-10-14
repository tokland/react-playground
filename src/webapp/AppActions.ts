import { CompositionRoot } from "../compositionRoot";
import { AppState } from "../domain/entities/AppState";
import { Async } from "../domain/entities/Async";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { EffectResult } from "./components/app/App";

export type ActionCommand =
    | { type: "getState" }
    | { type: "setStateFn"; fn: (state: AppState) => AppState }
    | { type: "effect"; value$: Async<unknown> };

export type Action = Generator<ActionCommand, void, any>;

interface Options {
    compositionRoot: CompositionRoot;
    feedback: Feedback;
}

export interface Feedback {
    success(msg: string): void;
    error(msg: string): void;
}

class BaseActions {
    protected compositionRoot: CompositionRoot;

    constructor(protected options: Options) {
        this.compositionRoot = options.compositionRoot;
    }

    protected *getState(): Generator<ActionCommand, AppState, AppState> {
        return yield { type: "getState" };
    }

    protected *set(setter: (state: AppState) => AppState): Generator<ActionCommand, void, void> {
        yield { type: "setStateFn", fn: setter };
    }

    protected *effect<T>(
        value$: Async<T>
    ): Generator<ActionCommand, EffectResult<T>, EffectResult<T>> {
        const res = yield { type: "effect", value$ };
        return res;

        /*

        if (res.type === "success") {
            return res.value;
        } else {
            this.options.feedback.error(`[feedback] ${res.error.message}`);
            throw new Error("Stop");
        }
        */
    }
}

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
        if (status === "loading") return;

        yield* this.set(state => state.setCounterAsLoading(id));
        const res = yield* this.effect(this.compositionRoot.counters.get(id));
        if (res.type === "success") {
            yield* this.set(state => state.setCounter(res.value));
        }
    }

    *save(counter: Counter) {
        yield* this.set(state => state.setCounter(counter, { isUpdating: true }));
        const res = yield* this.effect(this.compositionRoot.counters.save(counter));
        yield* this.set(state => state.setCounter(counter, { isUpdating: false }));
        if (res.type === "error") {
            this.options.feedback.error(`[feedback] ${res.error.message}`);
        }
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
