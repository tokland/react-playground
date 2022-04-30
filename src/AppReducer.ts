import { Reducer, getActions } from "./StateReducer";

/* State */

export interface AppState {
    auth: AuthState;
    counter1: CounterState;
    counter2: CounterState;
}

interface AuthState {
    session: SessionState | null;
}

interface SessionState {
    username: string;
}

interface CounterState {
    value: number;
}

/* Reducers */

export class CounterReducer extends Reducer<CounterState> {
    add = (n: number) => ({ value: this.state.value + n });
    increment = () => this.add(1);
    reset = () => ({ value: 0 });
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
        counter1: CounterReducer,
        counter2: CounterReducer,
    };
    reset = () => initialAppState;
}

/* Usage example */

export const app = getActions(AppReducer);

export const initialAppState: AppState = {
    auth: { session: null },
    counter1: { value: 1 },
    counter2: { value: 2 },
};

console.log("reset", app.reset());
console.log("counter1=3", app.counter1.add(2));
console.log("session=user1", app.auth.session.login("user1"));
