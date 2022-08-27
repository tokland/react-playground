import { Id } from "../domain/entities/Base";
import { Counter } from "../domain/entities/Counter";
import { CountersRepository } from "../domain/repositories/CountersRepository";

export class CountersBrowserStorageRepository implements CountersRepository {
    async get(id: Id): Promise<Counter> {
        const value = window.localStorage.getItem(`counter-${id}`);
        return { id, value: value ? parseInt(value) : 0 };
    }

    async save(counter: Counter): Promise<Counter> {
        window.localStorage.setItem(`counter-${counter.id}`, counter.value.toString());
        return counter;
    }
}
