import { CancellablePromise, pseudoCancellable } from "real-cancellable-promise";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { CountersRepository } from "../domain/repositories/CountersRepository";

export class CountersBrowserStorageRepository implements CountersRepository {
    get(id: Id): CancellablePromise<Counter> {
        const value = window.localStorage.getItem(this.getKey(id));
        const counter: Counter = { id, value: value ? parseInt(value) : 0 };
        return pseudoCancellable(Promise.resolve(counter));
    }

    save(counter: Counter): CancellablePromise<Counter> {
        const key = this.getKey(counter.id);
        const value = counter.value.toString();
        window.localStorage.setItem(key, value);
        return pseudoCancellable(Promise.resolve(counter));
    }

    private getKey(id: Id): string {
        return `counter-${id}`;
    }
}
