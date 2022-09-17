import { CancellablePromise, Cancellation } from "real-cancellable-promise";

export type Cancel = () => void;

export interface Effect<T> {
    run(success: (data: T) => void, reject: (msg: string) => void): Cancel;
}

export function cancellablePromiseToEffect<T>(promise: CancellablePromise<T>): Effect<T> {
    return {
        run(success, reject) {
            return promise.then(success).catch(err => {
                if (!(err instanceof Cancellation)) {
                    reject(err);
                }
            }).cancel;
        },
    };
}
