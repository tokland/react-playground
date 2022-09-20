import { CancellablePromise, Cancellation } from "real-cancellable-promise";

export type Cancel = () => void;

export interface Effect<Data> {
    run(success: (data: Data) => void, reject: (msg: string) => void): Cancel;
}

export function toEffect<Data>(promise: CancellablePromise<Data>): Effect<Data> {
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
