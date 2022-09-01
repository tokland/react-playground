import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { CountersRepository } from "../domain/repositories/CountersRepository";

export class CountersBrowserStorageRepository implements CountersRepository {
    async get(id: Id): Promise<Counter> {
        const value = window.localStorage.getItem(this.getKey(id));
        return { id, value: value ? parseInt(value) : 0 };
    }

    async save(counter: Counter): Promise<Counter> {
        const key = this.getKey(counter.id);
        const value = counter.value.toString();
        window.localStorage.setItem(key, value);
        return counter;
    }

    private getKey(id: Id): string {
        return `counter-${id}`;
    }
}
