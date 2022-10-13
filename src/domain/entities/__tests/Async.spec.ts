import { Async, AsyncError } from "../Async";

describe("Basic builders", () => {
    test("Async.success", async () => {
        const value$ = Async.success(10);
        expect(value$.toPromise()).resolves.toEqual(10);
    });

    test("Async.error", async () => {
        const value$ = Async.error("message");
        expect(value$.toPromise()).rejects.toEqual(new AsyncError("message"));
    });
});

describe("run", () => {
    it("calls the sucess branch with the value", async () => {
        const success = jest.fn();
        const reject = jest.fn();

        Async.success(1).run(success, reject);
        await nextTick();

        expect(success).toHaveBeenCalledTimes(1);
        expect(reject).not.toHaveBeenCalled();
        expect(success.mock.calls).toEqual([[1]]);
    });

    it("calls the error branch with the error", async () => {
        const success = jest.fn();
        const reject = jest.fn();

        Async.error("message").run(success, reject);
        await nextTick();

        expect(success).not.toHaveBeenCalled();
        expect(reject).toHaveBeenCalledTimes(1);
        expect(reject.mock.calls).toEqual([[new AsyncError("message")]]);
    });
});

describe("toPromise", () => {
    it("convert an Async to a normal Promise", () => {
        expect(Async.success(1).toPromise()).resolves.toEqual(1);
    });
});

describe("helpers", () => {
    test("Async.delay", async () => {
        expect(Async.delay(1).toPromise()).resolves.toBeUndefined();
    });

    test("Async.void", async () => {
        expect(Async.void().toPromise()).resolves.toBeUndefined();
    });
});

describe("transformers", () => {
    describe("map", () => {
        it("transforms the async value with a plain function mapper", async () => {
            const value1$ = Async.success(1);
            const value2$ = value1$.map(x => x.toString());

            expect(value2$.toPromise()).resolves.toEqual("1");
        });
    });

    describe("flatMap", () => {
        it("transform the async value with a function mapper that returns another async", async () => {
            const value1$ = Async.success(1);
            const value2$ = value1$
                .flatMap(value => Async.success(value + 2))
                .flatMap(value => Async.success(value + 3));

            expect(value2$.toPromise()).resolves.toEqual(6);
        });
    });
});

describe("Async.block", () => {
    describe("when all awaited values in the block are successful", () => {
        it("returns the resulting value", async () => {
            const result$ = Async.block(async $ => {
                const value1 = await $(Async.success(1));
                const value2 = await $(Async.success(2));
                const value3 = await $(Async.success(3));
                return value1 + value2 + value3;
            });

            expect(result$.toPromise()).resolves.toEqual(6);
        });
    });

    describe("when any the awaited values in the block is an error", () => {
        it("returns that error as the result", async () => {
            const result$ = Async.block(async $ => {
                const value1 = await $(Async.success(1));
                const value2 = await $(Async.error<number>("message"));
                const value3 = await $(Async.success(3));
                return value1 + value2 + value3;
            });

            expect(result$.toPromise()).rejects.toThrow(new AsyncError("message"));
        });
    });

    describe("when the helper $.error is called", () => {
        it("returns that async error as the result", async () => {
            const result$ = Async.block(async ($): Promise<number> => {
                if (parseInt("2") > 1) return $.error("message");
                return $(Async.success(1));
            });

            expect(result$.toPromise()).rejects.toThrow(new AsyncError("message"));
        });
    });
});

function nextTick() {
    return new Promise(process.nextTick);
}
