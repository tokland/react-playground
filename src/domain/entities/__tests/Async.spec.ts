import { Async } from "../Async";

test("success", async () => {
    const value = await successOf(Async.success(10));
    expect(value).toEqual(10);
});

test("run with success", async () => {
    const asyncValue = Async.success(1);
    const success = jest.fn();
    const reject = jest.fn();

    asyncValue.run(success, reject);
    await new Promise(process.nextTick);

    expect(success).toHaveBeenCalledTimes(1);
    expect(reject).not.toHaveBeenCalled();
    expect(success.mock.calls).toEqual([[1]]);
});

test("run with error", async () => {
    const asyncValue = Async.error("err");
    const success = jest.fn();
    const reject = jest.fn();
    asyncValue.run(success, reject);
    await new Promise(process.nextTick);

    expect(success).not.toHaveBeenCalled();
    expect(reject).toHaveBeenCalledTimes(1);
    expect(reject.mock.calls).toEqual([["err"]]);
});

test("void", async () => {
    const asyncVoid = Async.void();
    const value1 = await successOf(asyncVoid);
    expect(value1).toBeUndefined();
});

test("delay", async () => {
    const asyncDelay = Async.delay(1);
    const value1 = await successOf(asyncDelay);
    expect(value1).toBeUndefined();
});

test("map", async () => {
    const async1 = Async.success(1);
    const async4 = async1.map(x => x + 3);
    const value4 = await successOf(async4);

    expect(value4).toEqual(4);
});

test("flatMap", async () => {
    const value1$ = Async.success(1);
    const value2$ = value1$
        .flatMap(value => Async.success(value + 2))
        .flatMap(value => Async.success(value + 3));

    expect(value2$.toPromise()).resolves.toEqual(6);
});

describe(".block", () => {
    test("returns successful async value", async () => {
        const asyncValue = Async.block(async $ => {
            const value1 = await $(Async.success(1));
            const value2 = await $(Async.success(2));
            const value3 = await $(Async.success(3));
            return value1 + value2 + value3;
        });

        expect(asyncValue.toPromise()).resolves.toEqual(6);
    });

    test("returns an async error if an intermediate awaited value fails", async () => {
        const asyncValue = Async.block(async $ => {
            const value1 = await $(Async.success(1));
            const value2 = await $(Async.error<number>("Error message"));
            const value3 = await $(Async.success(3));
            return value1 + value2 + value3;
        });

        expect(asyncValue.toPromise()).rejects.toThrow("Error message");
    });

    test("returns an async error if $.error is returned in the block", async () => {
        const asyncValue = Async.block(async ($): Promise<number> => {
            if (1 + 2 > 1) return $.error("Error message");
            return $(Async.success(1));
        });

        expect(asyncValue.toPromise()).rejects.toThrow("Error message");
    });
});

async function successOf<T>(asyncValue: Async<T>): Promise<T> {
    return asyncValue.toPromise();
}
