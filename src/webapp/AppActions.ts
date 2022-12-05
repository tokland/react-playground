import { CompositionRoot } from "../compositionRoot";
import { AppState, Feedback } from "../domain/entities/AppState";
import { Async } from "../domain/entities/Async";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { buildReducer } from "../libs/reducer";
import { Store } from "./Store";

const state$ = buildReducer(AppState);

interface Options {
    compositionRoot: CompositionRoot;
    store: Store<AppState>;
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
        return this.options.store.set(newState);
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
