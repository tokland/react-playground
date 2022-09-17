import _ from "lodash";
import {
    buildCancellablePromise,
    CancellablePromise,
    Cancellation,
    CaptureCancellablePromise,
} from "real-cancellable-promise";
import { CompositionRoot } from "../compositionRoot";
import { AppState } from "../domain/entities/AppState";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { Maybe } from "../libs/ts-utils";
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
        const newState = this.state.update(state);
        return this.options.store.setState(newState);
    }

    protected effect<U>(
        fn: (capture: CaptureCancellablePromise) => Promise<U>
    ): CancellablePromise<U | undefined> {
        return buildCancellablePromise(fn).catch(err => {
            if (err instanceof Cancellation) {
                console.log("Promise cancelled");
            } else {
                return Promise.reject(err);
            }
        });
    }
}

class SessionActions extends BaseActions {
    login = (username: string) => {
        return this.setState({ session: { type: "loggedIn", username } });
    };

    logout = () => {
        return this.setState({
            page: { type: "home" },
            session: { type: "unauthenticated" },
        });
    };
}

export class AppActions extends BaseActions {
    session = new SessionActions(this.options);

    routes = {
        goToHome: () => this.setState({ page: { type: "home" } }),

        goToCounter: (id: Id) => {
            const counter = this.state.counters[id];
            const status = counter?.status;

            if (status === "loading" || status === "loaded") {
                return this.setState({
                    page: { type: "counter", id },
                });
            } else {
                return this.effect(async $ => {
                    this.setState({
                        page: { type: "counter", id },
                        counters: { ...this.state.counters, [id]: { status: "loading", id } },
                    });

                    const counter = await $(this.compositionRoot.counters.get(id));

                    this.setCounter(counter, { isUpdating: false });
                });
            }
        },
    };

    counter = {
        set: (counter: Counter) => {
            this.setCounter(counter, { isUpdating: false });
        },

        save: (counter: Counter) =>
            this.effect(async $ => {
                this.setCounter(counter, { isUpdating: true });
                await $(this.compositionRoot.counters.save(counter));
                this.setCounter(counter, { isUpdating: false });
            }),
    };

    /* Private */

    private getCounter(id: Id): Maybe<Counter> {
        const loader = this.state.counters[id];
        return loader && loader.status === "loaded" ? loader.value : undefined;
    }

    private setCounter(counter: Counter, options: { isUpdating: boolean }) {
        this.setState({
            counters: {
                ...this.state.counters,
                [counter.id]: { status: "loaded", value: counter, ...options },
            },
        });
    }
}
