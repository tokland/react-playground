import _ from "lodash";
import {
    buildCancellablePromise,
    CancellablePromise,
    Cancellation,
} from "real-cancellable-promise";
import { CompositionRoot } from "../compositionRoot";
import { AppState } from "../domain/entities/AppState";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { SetState } from "./StoreState";

export class AppStore {
    constructor(private compositionRoot: CompositionRoot, private setState: SetState<AppState>) {}

    session = {
        login: (username: string) => {
            return this.setState({
                session: { type: "logged", username },
            });
        },

        logout: () => {
            return this.setState({
                session: { type: "notLogged" },
                page: { type: "home" },
            });
        },
    };

    routes = {
        goToHome: () => {
            return this.setState({
                page: { type: "home" },
            });
        },

        loadCounterAndGoToCounterPage: async (id: Id) => {
            return this.withLoader(async () => {
                const counter = await this.compositionRoot.counters.get(id);
                this.setState({
                    page: { type: "counter" },
                    counter,
                });
            });
        },
    };

    counter = {
        set: async (id: Id) => {
            // return compositionRoot.counters.get(id).run(counter => this.setState({ counter }), onErr)
            // return this.setStateFromEffect(compositionRoot.counters.get(id))
            const counter = await this.compositionRoot.counters.get(id);
            this.setState({ counter });
        },

        add: (n: number) => {
            let cancel: (reason?: string) => void = _.noop;

            const newStateP = new Promise<Partial<AppState>>((resolve, reject) => {
                return this.setState(state => {
                    const counter = this.getCounter(state);

                    const newState$ = this.compositionRoot.counters
                        .add(counter, n)
                        .then(counterUpdated => ({ counter: counterUpdated }));

                    newState$.then(resolve).catch(reject);
                    cancel = newState$.cancel;

                    return newState$;
                });
            });

            return new CancellablePromise(newStateP, cancel);
        },
    };

    /* Private */

    /*
    private setState2(mapper: (state: AppState) => CancellablePromise<unknown>) {
        this.setState(state => {
            const res = mapper(state);
            return res.cancel;
        });
    }
    */

    private getCounter(state: AppState) {
        const counter = state.counter;
        if (!counter) throw new Error("Counter not loaded");
        return counter;
    }

    private withLoader(fn: () => void) {
        try {
            this.setState({ isLoading: true });
            fn();
        } finally {
            this.setState({ isLoading: false });
        }
    }
}
