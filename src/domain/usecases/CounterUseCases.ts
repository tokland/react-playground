import { Async } from "../entities/Async";
import { Id } from "../entities/Base";
import { Counter } from "../entities/Counter";
import { CountersRepository } from "../repositories/CountersRepository";

export class CounterUseCases {
    constructor(private countersRepository: CountersRepository) {}

    get(id: Id): Async<Counter> {
        return this.countersRepository.get(id);
    }

    save(counter: Counter): Async<Counter> {
        //return Async.error("fail on save");
        return this.countersRepository.save(counter);
    }
}
