import { buildCancellablePromise, CancellablePromise } from "real-cancellable-promise";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { CountersRepository } from "../domain/repositories/CountersRepository";

export class CountersBrowserStorageRepository implements CountersRepository {
    get(id: Id): CancellablePromise<Counter> {
        const value = window.localStorage.getItem(this.getKey(id));
        const counter: Counter = { id, value: value ? parseInt(value) : 0 };
        return CancellablePromise.delay(1000).then(() => counter);
    }

    save(counter: Counter): CancellablePromise<Counter> {
        return buildCancellablePromise(async $ => {
            const key = this.getKey(counter.id);
            const value = counter.value.toString();
            await $(CancellablePromise.delay(1000));
            console.log("localStore.setItem", key, "=", value);
            window.localStorage.setItem(key, value);
            return counter;
        });
    }

    private getKey(id: Id): string {
        return `counter-${id}`;
    }
}
