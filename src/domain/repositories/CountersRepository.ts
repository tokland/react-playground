import { CancellablePromise } from "real-cancellable-promise";
import { Id } from "../entities/Base";
import { Counter } from "../entities/Counter";

export interface CountersRepository {
    get(id: Id): CancellablePromise<Counter>;
    save(counter: Counter): CancellablePromise<Counter>;
}
