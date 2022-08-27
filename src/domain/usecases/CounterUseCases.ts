import { Id } from "../entities/Base";
import { Counter } from "../entities/Counter";
import { CountersRepository } from "../repositories/CountersRepository";

export class CounterUseCases {
    constructor(private countersRepository: CountersRepository) {}

    get(id: Id): Promise<Counter> {
        return this.countersRepository.get(id);
    }

    save(counter: Counter): Promise<void> {
        return this.countersRepository.save(counter);
    }
}
