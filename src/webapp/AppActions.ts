import _ from "lodash";
import { buildCancellablePromise, CaptureCancellablePromise } from "real-cancellable-promise";
import { CompositionRoot } from "../compositionRoot";
import { AppState, AppStateAttrs, Loader } from "../domain/entities/AppState";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { Effect, toEffect } from "../libs/effect";
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

    protected get state() {
        return this.options.store.state;
    }

    protected setState(attributes: Partial<AppStateAttrs>) {
        const newState = AppState.update(this.state, attributes);
        return this.options.store.setState(newState);
    }

    protected effect<U>(fn: (capture: CaptureCancellablePromise) => Promise<U>): Effect<U> {
        return toEffect(buildCancellablePromise(fn));
    }
}

class SessionActions extends BaseActions {
    login = (username: string) =>
        this.setState({
            session: { type: "loggedIn", username },
        });

    logout = () =>
        this.setState({
            page: { type: "home" },
            session: { type: "unauthenticated" },
        });
}

export class AppActions extends BaseActions {
    session = new SessionActions(this.options);

    routes = {
        goToHome: () => this.setState({ page: { type: "home" } }),

        goToCounter: (id: Id) => {
            this.setState({ page: { type: "counter", id } });
            return this.counter.load(id);
        },
    };

    counter = {
        set: (counter: Counter) => {
            this.setCounter(counter);
        },

        load: (id: Id) => {
            const counter = this.state.counters.get(id);
            const status = counter?.status;

            if (status === "loading" || status === "loaded") return;

            this.setState({
                counters: this.state.counters.set(id, { status: "loading", id }),
            });

            return toEffect(this.compositionRoot.counters.get(id).then(this.setCounter));
        },

        save: (counter: Counter) =>
            this.effect(async $ => {
                this.setCounter(counter, { isUpdating: true });
                await $(this.compositionRoot.counters.save(counter));
                this.setCounter(counter);
            }),
    };

    /* Private */

    private setCounter = (counter: Counter, options?: { isUpdating: boolean }) => {
        const { isUpdating = false } = options || {};
        const { counters } = this.state;
        const loader: Loader<Counter> = { status: "loaded", value: counter, isUpdating };

        this.setState({ counters: counters.set(counter.id, loader) });
    };
}
