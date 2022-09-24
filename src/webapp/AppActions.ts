import { CompositionRoot } from "../compositionRoot";
import { AppState, AppStateAttrs, Loader } from "../domain/entities/AppState";
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

    protected get state() {
        return this.options.store.state;
    }

    protected setState(attributes: Partial<AppStateAttrs>) {
        const newState = this.state._update(attributes);
        return this.options.store.setState(newState);
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

        load: (id: Id): Async<void> => {
            const counter = this.state.counters.get(id);
            const status = counter?.status;

            if (status === "loading" || status === "loaded") return Async.void();

            this.setState({
                counters: this.state.counters.set(id, { status: "loading", id }),
            });

            return this.compositionRoot.counters.get(id).map(this.setCounter);
        },

        save: (counter: Counter): Async<void> =>
            Async.block(async $ => {
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
