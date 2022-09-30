import {
    buildCancellablePromise,
    CancellablePromise,
    Cancellation,
} from "real-cancellable-promise";

export class Async<T> {
    private constructor(private _promise: () => CancellablePromise<T>) {}

    static of<T>(data: T): Async<T> {
        return new Async(() => CancellablePromise.resolve(data));
    }

    toPromise(): Promise<T> {
        return this._promise();
    }

    run(success: (data: T) => void, reject: (msg: string) => void): Cancel {
        return this._promise()
            .then(success)
            .catch(err => {
                if (!(err instanceof Cancellation)) {
                    reject(err);
                }
            }).cancel;
    }

    map<U>(mapper: (data: T) => U): Async<U> {
        return new Async(() => this._promise().then(mapper));
    }

    static delay(ms: number) {
        return new Async(() => CancellablePromise.delay(ms));
    }

    static void(): Async<void> {
        return new Async(() => CancellablePromise.resolve(undefined));
    }

    static block<U>(blockFn: (captureAsync: CaptureAsync) => Promise<U>): Async<U> {
        const result: CancellablePromise<U> = buildCancellablePromise(capturePromise => {
            const captureAsync: CaptureAsync = async => capturePromise(async._promise());
            return blockFn(captureAsync);
        });

        return new Async(() => result);
    }
}

type CaptureAsync = <T>(async: Async<T>) => Promise<T>;

type Cancel = () => void;
