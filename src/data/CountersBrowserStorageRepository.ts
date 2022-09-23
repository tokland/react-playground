import { Async } from "../domain/entities/Async";
import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { CountersRepository } from "../domain/repositories/CountersRepository";

export class CountersBrowserStorageRepository implements CountersRepository {
    get(id: Id): Async<Counter> {
        const value = window.localStorage.getItem(this.getKey(id));
        const counter: Counter = new Counter({ id, value: value ? parseInt(value) : 0 });
        return Async.delay(1000).map(() => counter);
    }

    save(counter: Counter): Async<Counter> {
        return Async.block(async $ => {
            const key = this.getKey(counter.id);
            const value = counter.value.toString();
            await $(Async.delay(1000));
            console.log("localStore.setItem", key, "=", value);
            window.localStorage.setItem(key, value);
            return counter;
        });
    }

    private getKey(id: Id): string {
        return `counter-${id}`;
    }
}
