import { getRandom } from "./Counter";
import { Dispatcher } from "./StateContext";
import { Reducer, getActions, IReducer } from "./StateReducer";

/* State */

export interface AppState {
    auth: AuthState;
    counter: CounterState;
}

interface AuthState {
    session: SessionState | null;
}

interface SessionState {
    username: string;
}

interface CounterState {
    value: number;
    updating: boolean;
}

/* Reducers */

type ResP<State> = State | Promise<State>;
type Res<State> = State | Async<State>;
type Async<State> = (callback: (state: State) => void) => Canceller;
type Canceller = () => void;

export class CounterReducer extends Reducer<CounterState> {
    // implements IReducer<CounterReducer> {
    add = (n: number) => ({ ...this.state, value: this.state.value + n });
    increment = () => this.add(1);
    reset = () => ({ ...this.state, value: 0 });
    startUpdate = () => ({ ...this.state, updating: true });
    stopUpdate = () => ({ ...this.state, updating: false });

    *addRandom() {
        yield this.startUpdate();
        yield getRandom({ min: 1, max: 10 })
            .then(num => this.add(num))
            .catch(() => "what?");
        yield this.stopUpdate();
    }
}

class SessionReducer extends Reducer<SessionState> {
    login = (username: string) => ({ username });
}

class AuthReducer extends Reducer<AuthState> {
    static nested = {
        session: SessionReducer,
    };
}

export class AppReducer extends Reducer<AppState> {
    static nested = {
        auth: AuthReducer,
        counter: CounterReducer,
    };
    reset = () => initialAppState;
}

/* Usage example */

export const app = getActions(AppReducer);

export const initialAppState: AppState = {
    auth: { session: null },
    counter: { value: 1, updating: false },
};

/*
console.log("reset", app.reset());
console.log("counter1=3", app.counter1.add(2));
console.log("session=user1", app.auth.session.login("user1"));
*/
