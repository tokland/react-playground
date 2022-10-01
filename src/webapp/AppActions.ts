import { CompositionRoot } from "../compositionRoot";
import { AppState } from "../domain/entities/AppState";
import { Async } from "../domain/entities/Async";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { Store } from "./hooks/useStoreState";

interface Options {
    store: Store<AppState>;
    compositionRoot: CompositionRoot;
}

class BaseActions {
    protected compositionRoot: CompositionRoot;

    constructor(protected options: Options) {
        this.compositionRoot = options.compositionRoot;
    }

    protected *getState(): Generator<ActionYield, AppState, AppState> {
        const res = yield { type: "getState" };
        return res;
    }

    protected *setState(setter: (state: AppState) => AppState): Generator<ActionYield, void, void> {
        yield { type: "setStateFn", fn: setter };
    }

    protected *effect<T>(value$: Async<T>): Generator<ActionYield, T, T> {
        const res = yield { type: "effect", value$ };
        return res;
    }
}

export type ActionYield =
    | { type: "getState" }
    | { type: "setStateFn"; fn: (state: AppState) => AppState }
    | { type: "effect"; value$: Async<any> };

export type Action = Generator<ActionYield, void, any>;

class SessionActions extends BaseActions {
    login = (username: string) => this.setState(state => state.login(username));
    logout = () => this.setState(state => state.logout());
}

class CounterActions extends BaseActions {
    set(counter: Counter) {
        return this.setState(state => state.setCounter(counter));
    }

    *load(id: Id) {
        const state = yield* this.getState();
        const status = state.counters.get(id)?.status;

        if (status === "loading" || status === "loaded") return;

        yield* this.setState(state => state.setCounterAsLoading(id));
        const counter = yield* this.effect(this.compositionRoot.counters.get(id));
        yield* this.setState(state => state.setCounter(counter));
    }

    *save(counter: Counter) {
        yield* this.setState(state => state.setCounter(counter, { isUpdating: true }));
        yield* this.effect(this.compositionRoot.counters.save(counter.add(1)));
        yield* this.setState(state => state.setCounter(counter, { isUpdating: true }));
        yield* this.effect(this.compositionRoot.counters.save(counter));
        yield* this.setState(state => state.setCounter(counter));
    }

    *loadCounterAndSetAsCurrentPage(id: Id) {
        yield* this.setState(state => state.goToCounter(id));
        yield* this.load(id);
    }
}

export class AppActions extends BaseActions {
    session = new SessionActions(this.options);

    routes = {
        goToHome: () => this.setState(state => state.goToHome()),
    };

    counter = new CounterActions(this.options);
}
