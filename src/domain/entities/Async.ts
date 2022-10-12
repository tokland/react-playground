import {
    buildCancellablePromise,
    CancellablePromise,
    Cancellation,
} from "real-cancellable-promise";

export class Async<T> {
    private constructor(private _promise: () => CancellablePromise<T>) {}

    static success<T>(data: T): Async<T> {
        return new Async(() => CancellablePromise.resolve(data));
    }

    static error<T>(message: string, name = "GenericError"): Async<T> {
        return new Async(() => CancellablePromise.reject(buildError(name, message)));
    }

    static fromComputation<T>(computation: Computation<T>): Async<T> {
        let cancel: Cancel;

        return new Async(() => {
            const promise = new Promise<T>((resolve, reject) => {
                cancel = computation(resolve, reject);
            });

            return new CancellablePromise(promise, cancel);
        });
    }

    run(onSuccess: (data: T) => void, onError: (msg: string) => void): Cancel {
        return this._promise().then(onSuccess, err => {
            if (err instanceof Cancellation) {
                // noop
            } else if (err instanceof Error) {
                onError(err.message);
            } else {
                onError("Unknown error");
            }
        }).cancel;
    }

    map<U>(fn: (data: T) => U): Async<U> {
        return new Async(() => this._promise().then(fn));
    }

    flatMap<U>(fn: (data: T) => Async<U>): Async<U> {
        return new Async(() => this._promise().then(data => fn(data)._promise()));
    }

    toPromise(): Promise<T> {
        return this._promise();
    }

    static delay(ms: number) {
        return new Async(() => CancellablePromise.delay(ms));
    }

    static void(): Async<void> {
        return Async.success(undefined);
    }

    static block<U>(blockFn: (captureAsync: CaptureAsync) => Promise<U>): Async<U> {
        return new Async((): CancellablePromise<U> => {
            return buildCancellablePromise(capturePromise => {
                const captureAsync: CaptureAsync = async => capturePromise(async._promise());
                captureAsync.error = (msg, name) =>
                    capturePromise(CancellablePromise.reject(new Error(msg)));
                return blockFn(captureAsync);
            });
        });
    }
}

function buildError(name: string, message: string): AsyncError {
    return { name, message, stack: new Error().stack || "" };
}

interface AsyncError {
    name: string;
    message: string;
    stack: string;
}

export type Computation<Data> = (
    resolve: (value: Data) => void,
    reject: (error: AsyncError) => void
) => Cancel;

interface CaptureAsync {
    <T>(async: Async<T>): Promise<T>;
    error: <T>(message: string, name?: string) => Promise<T>;
}

type Cancel = () => void;
