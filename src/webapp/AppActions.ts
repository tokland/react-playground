import _ from "lodash";
import {
    buildCancellablePromise,
    CancellablePromise,
    CaptureCancellablePromise,
} from "real-cancellable-promise";
import { CompositionRoot } from "../compositionRoot";
import { AppState } from "../domain/entities/AppState";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { Store } from "./hooks/useStoreState";

interface Options {
    compositionRoot: CompositionRoot;
    store: Store<AppState>;
}

class BaseActions {
    protected compositionRoot: CompositionRoot;

    constructor(protected options: Options) {
        this.compositionRoot = options.compositionRoot;
    }

    protected get state() {
        return this.options.store.state;
    }

    protected setState(state: Partial<AppState>) {
        const newState: AppState = { ...this.options.store.state, ...state };
        return this.options.store.setState(newState);
    }

    protected withLoader<U>(
        fn: (capture: CaptureCancellablePromise) => Promise<U>
    ): CancellablePromise<U> {
        try {
            this.setState({ isLoading: true });
            return buildCancellablePromise(fn);
        } finally {
            this.setState({ isLoading: false });
        }
    }
}

class SessionActions extends BaseActions {
    login = (username: string) => {
        return this.setState({
            session: { type: "logged", username },
        });
    };

    logout = () => {
        return this.setState({
            page: { type: "home" },
            session: { type: "notLogged" },
        });
    };
}

export class AppActions extends BaseActions {
    session = new SessionActions(this.options);

    routes = {
        goToHome: () => {
            return this.setState({
                page: { type: "home" },
            });
        },

        loadCounterAndGoToPage: (id: Id) => {
            return this.withLoader(async $ => {
                this.setState({
                    page: { type: "counter", id, isLoading: true },
                });
                const counter = await $(this.compositionRoot.counters.get(id));
                this.setState({
                    page: { type: "counter", id, isLoading: false },
                    counter,
                });
            });
        },
    };

    counter = {
        set: (counter: Counter) => {
            this.setState({ counter });
        },

        save: () =>
            this.withLoader(() => {
                const counter = this.getCounter();
                return this.compositionRoot.counters.save(counter);
            }),
    };

    /* Private */

    private getCounter() {
        const counter = this.state.counter;
        if (!counter) throw new Error("Counter not loaded");
        return counter;
    }
}
