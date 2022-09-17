import { CancellablePromise, Cancellation } from "real-cancellable-promise";

export type Cancel = () => void;

export interface Effect<T> {
    run(success: (data: T) => void, error: (msg: string) => void): Cancel;
}

export function cancellablePromiseToEffect<T>(cPromise: CancellablePromise<T>): Effect<T> {
    return {
        run(success, error) {
            return cPromise.then(success).catch(err => {
                if (err instanceof Cancellation) {
                    console.log("Promise cancelled");
                } else {
                    error(err);
                }
            }).cancel;
        },
    };
}
