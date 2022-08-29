import { CompositionRoot } from "../compositionRoot";
import { AppState } from "../domain/entities/AppState";
import { Id } from "../domain/entities/Base";
import { Dispatcher } from "./StoreState";

export class AppStore {
    constructor(private compositionRoot: CompositionRoot, private dispatch: Dispatcher<AppState>) {}

    async goToHome() {
        return this.dispatch(() => ({ page: { type: "home" } }));
    }
    async goToCounter(id: Id) {
        return this.withLoader(async () => {
            const counter = await this.compositionRoot.counters.get(id);
            this.dispatch(() => ({ page: { type: "counter" }, counter }));
        });
    }

    async addCounter(n: number) {
        // return Promise on finish
        return this.dispatch(async state => {
            const counter = this.getCounter(state);
            const counterUpdated = await this.compositionRoot.counters.add(counter, n);
            return { counter: counterUpdated };
        });
    }

    private getCounter(state: AppState) {
        const counter = state.counter;
        if (!counter) throw new Error("Counter not loaded");
        return counter;
    }

    private withLoader(fn: () => void) {
        try {
            this.dispatch(state => ({ isLoading: true }));
            fn();
        } finally {
            this.dispatch(state => ({ isLoading: false }));
        }
    }
}
