import { CancellablePromise } from "real-cancellable-promise";
import { Id } from "../entities/Base";
import { Counter, counterReducer } from "../entities/Counter";
import { CountersRepository } from "../repositories/CountersRepository";

export class CounterUseCases {
    constructor(private countersRepository: CountersRepository) {}

    get(id: Id): CancellablePromise<Counter> {
        return this.countersRepository.get(id);
    }

    save(counter: Counter): CancellablePromise<Counter> {
        return this.countersRepository.save(counter);
    }

    add(counter: Counter, n: number): CancellablePromise<Counter> {
        const counterUpdated = counterReducer.add(n)(counter);
        return this.countersRepository.save(counterUpdated);
    }
}
