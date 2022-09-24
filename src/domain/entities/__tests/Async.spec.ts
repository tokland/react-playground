import { Async } from "../Async";

const async1 = Async.of(1);

test("of", async () => {
    const value1 = await successOf(async1);
    expect(value1).toEqual(1);
});

test("run", async () => {
    const asyncValue = Async.of(1);

    const success = jest.fn();
    const reject = jest.fn();
    asyncValue.run(success, reject);

    await new Promise(process.nextTick);

    expect(success).toHaveBeenCalledTimes(1);
    expect(reject).not.toHaveBeenCalled();
    expect(success.mock.calls).toEqual([[1]]);
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
    const async4 = async1.map(x => x + 3);
    const value4 = await successOf(async4);
    expect(value4).toEqual(4);
});

test("block", async () => {
    const asyncValue = Async.block(async capture => {
        const value1 = await capture(Async.of(1));
        const value2 = await capture(Async.of(2));
        const value3 = await capture(Async.of(3));
        return value1 + value2 + value3;
    });

    const value = await successOf(asyncValue);
    expect(value).toEqual(6);
});

async function successOf<T>(asyncValue: Async<T>): Promise<T> {
    return asyncValue.toPromise();
}
