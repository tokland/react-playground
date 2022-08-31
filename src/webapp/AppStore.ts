import { CompositionRoot } from "../compositionRoot";
import { AppState } from "../domain/entities/AppState";
import { Id } from "../domain/entities/Base";
import { SetState } from "./StoreState";

export class AppStore {
    constructor(private compositionRoot: CompositionRoot, private setState: SetState<AppState>) {}

    session = {
        logout: () => {
            return this.setState({ session: { type: "notLogged" } });
        },
    };

    routes = {
        goToHome: () => {
            return this.setState({ page: { type: "home" } });
        },

        loadCounterAndSetPage: async (id: Id) => {
            return this.withLoader(async () => {
                const counter = await this.compositionRoot.counters.get(id);
                // TODO: setState could return a Promise when finished so caller can chain events
                this.setState({ page: { type: "counter" }, counter });
            });
        },
    };

    counter = {
        add: async (n: number) => {
            return this.setState(async state => {
                const counter = this.getCounter(state);
                const counterUpdated = await this.compositionRoot.counters.add(counter, n);
                return { counter: counterUpdated };
            });
        },
    };

    /* Private */

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
