import { CountersBrowserStorageRepository } from "./data/CountersBrowserStorageRepository";
import { CounterUseCases } from "./domain/usecases/CounterUseCases";

export function getCompositionRoot() {
    const countersRepository = new CountersBrowserStorageRepository();

    return {
        counters: new CounterUseCases(countersRepository),
    };
}

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;
