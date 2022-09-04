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
import { Store } from "./StoreState";

export class AppActions {
    constructor(private compositionRoot: CompositionRoot, private store: Store<AppState>) {}

    session = {
        login: (username: string) => {
            return this.setState({
                session: { type: "logged", username },
            });
        },

        logout: () => {
            return this.setState({
                page: { type: "home" },
                session: { type: "notLogged" },
            });
        },
    };

    routes = {
        goToHome: () => {
            return this.setState({
                page: { type: "home" },
            });
        },

        loadCounterAndGoToPage: async (id: Id) => {
            return this.withLoader(async capture => {
                this.setState({
                    page: { type: "counter", id, isLoading: true },
                });
                const counter = await capture(this.compositionRoot.counters.get(id));
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

        save: () => {
            return this.compositionRoot.counters
                .save(this.getCounter())
                .then(counterUpdated => this.setState({ counter: counterUpdated }))
                .catch(err => console.log("AppActions:", err.message));
        },
    };

    /* Private */

    private get state() {
        return this.store.state;
    }

    private setState(state: Partial<AppState>) {
        const newState: AppState = { ...this.store.state, ...state };
        return this.store.setState(newState);
    }

    private getCounter() {
        const counter = this.state.counter;
        if (!counter) throw new Error("Counter not loaded");
        return counter;
    }

    private withLoader<U>(
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
