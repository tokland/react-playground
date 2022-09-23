import { Async } from "../entities/Async";
import { Id } from "../entities/Base";
import { Counter } from "../entities/Counter";

export interface CountersRepository {
    get(id: Id): Async<Counter>;
    save(counter: Counter): Async<Counter>;
}
