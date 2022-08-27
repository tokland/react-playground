import { Id } from "../entities/Base";
import { Counter } from "../entities/Counter";

export interface CountersRepository {
    get(id: Id): Promise<Counter>;
    save(counter: Counter): Promise<void>;
}
