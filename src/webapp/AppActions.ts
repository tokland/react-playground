import { CompositionRoot } from "../compositionRoot";
import { AppState, AppStateAttrs } from "../domain/entities/AppState";
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
    login = (username: string) => this.setState(this.state.login(username));
    logout = () => this.setState(this.state.logout());
}

export class AppActions extends BaseActions {
    session = new SessionActions(this.options);

    routes = {
        goToHome: () => this.setState(this.state.goToHome()),

        goToCounter: (id: Id) => {
            this.setState(this.state.goToCounter(id));
            return this.counter.load(id);
        },
    };

    counter = {
        set: (counter: Counter) => this.setState(this.state.setCounter(counter)),

        load: (id: Id): Async<void> => {
            const counter = this.state.counters.get(id);
            const status = counter?.status;

            if (status === "loading" || status === "loaded") return Async.void();

            this.setState({
                counters: this.state.counters.set(id, { status: "loading" }),
            });

            // this.setState inside a map is not ok
            return this.compositionRoot.counters
                .get(id)
                .map(counter => this.setState(this.state.setCounter(counter)));
        },

        save: (counter: Counter): Async<void> =>
            Async.block(async $ => {
                this.setState(this.state.setCounter(counter, { isUpdating: true }));
                await $(this.compositionRoot.counters.save(counter));
                this.setState(this.state.setCounter(counter));
            }),
    };
}
