import { assertType } from "../../../libs/test-helpers";
import { Collection } from "../DataTools";

describe("Collection", () => {
    test("map", () => {
        const values = Collection.from([1, 2, 3]).map(x => 2 * x);
        expect(values.toArray()).toEqual([2, 4, 6]);
    });

    test("flatMap", () => {
        const values = Collection.from([1, 2, 3]).flatMap(x => Collection.from([x, 2 * x]));
        expect(values.toArray()).toEqual([1, 2, 2, 4, 3, 6]);
    });

    test("filter/select", () => {
        const values = Collection.from([1, 2, 3]).select(x => x > 1);
        expect(values.toArray()).toEqual([2, 3]);
    });

    test("reject", () => {
        const values = Collection.from([1, 2, 3]).reject(x => x > 1);
        expect(values.toArray()).toEqual([1]);
    });

    test("enumerate", () => {
        const values = Collection.from(["a", "b", "c"]).enumerate();

        expect(values.toArray()).toEqual([
            [0, "a"],
            [1, "b"],
            [2, "c"],
        ]);
    });

    test("compact", () => {
        const values = Collection.from([1, undefined, 2, null, 3]).compact();

        expect(values.toArray()).toEqual([1, 2, 3]);
        assertType<Collection<number>>(values);
    });

    test("compactMap", () => {
        const values = Collection.from([1, 2, 3]).compactMap(x =>
            x > 1 ? x.toString() : undefined
        );

        expect(values.toArray()).toEqual(["2", "3"]);
        assertType<Collection<string>>(values);
    });

    test("append", () => {
        const values = Collection.from([1, 2]).append(3);
        expect(values.toArray()).toEqual([1, 2, 3]);
    });

    test("includes", () => {
        const values = Collection.from([1, 2, 3]);

        expect(values.includes(2)).toEqual(true);
        expect(values.includes(4)).toEqual(false);
    });

    test("every/all", () => {
        const values = Collection.from([1, 2, 3]);

        expect(values.every(x => x > 0)).toEqual(true);
        expect(values.every(x => x > 1)).toEqual(false);
        expect(values.every(x => x > 3)).toEqual(false);

        expect(values.all(x => x > 0)).toEqual(true);
        expect(values.all(x => x > 1)).toEqual(false);
        expect(values.all(x => x > 3)).toEqual(false);
    });

    test("some/any", () => {
        const values = Collection.from([1, 2, 3]);

        expect(values.some(x => x > 0)).toEqual(true);
        expect(values.some(x => x > 1)).toEqual(true);
        expect(values.some(x => x > 3)).toEqual(false);

        expect(values.any(x => x > 0)).toEqual(true);
        expect(values.any(x => x > 1)).toEqual(true);
        expect(values.any(x => x > 3)).toEqual(false);
    });

    test("find", () => {
        const values = Collection.from([1, 2, 3]);

        expect(values.find(value => value === 2)).toEqual(2);
        expect(values.find(value => value === 4)).toEqual(undefined);
    });

    test("join", () => {
        expect(Collection.from(["a", "b", "c"]).join(" - ")).toEqual("a - b - c");
    });

    test("sort (strings)", () => {
        expect(Collection.from(["a", "c", "b"]).sort().toArray()).toEqual(["a", "b", "c"]);
        expect(Collection.from(["22", "3", "1"]).sort().toArray()).toEqual(["1", "22", "3"]);
    });

    test("sort (numbers)", () => {
        expect(Collection.from([2, 33, 1, 4]).sort().toArray()).toEqual([1, 2, 4, 33]);
    });

    test("sortBy", () => {
        const values = Collection.from([2, 33, 1, 4]);

        expect(values.sortBy(x => x).toArray()).toEqual([1, 2, 4, 33]);
        expect(values.sortBy(x => -x).toArray()).toEqual([33, 4, 2, 1]);
        expect(values.sortBy(x => x.toString()).toArray()).toEqual([1, 2, 33, 4]);
    });

    test("sortBy with custom compareFn", () => {
        const values = Collection.from([2, 33, 1, 4]);

        expect(
            values
                .sortBy(x => x, { compareFn: (a, b) => (a === 1 ? -1 : b === 1 ? +1 : 0) })
                .toArray()
        ).toEqual([1, 2, 33, 4]);
    });

    test("first", () => {
        expect(Collection.from([1, 2, 3]).first()).toEqual(1);
        expect(Collection.from([]).first()).toEqual(undefined);
    });

    test("last", () => {
        expect(Collection.from([1, 2, 3]).last()).toEqual(3);
        expect(Collection.from([]).last()).toEqual(undefined);
    });

    test("take", () => {
        expect(Collection.from([1, 2, 3]).take(0).toArray()).toEqual([]);
        expect(Collection.from([1, 2, 3]).take(1).toArray()).toEqual([1]);
        expect(Collection.from([1, 2, 3]).take(2).toArray()).toEqual([1, 2]);
        expect(Collection.from([1, 2, 3]).take(3).toArray()).toEqual([1, 2, 3]);
        expect(Collection.from([1, 2, 3]).take(10).toArray()).toEqual([1, 2, 3]);
    });

    test("drop", () => {
        expect(Collection.from([1, 2, 3]).drop(0).toArray()).toEqual([1, 2, 3]);
        expect(Collection.from([1, 2, 3]).drop(1).toArray()).toEqual([2, 3]);
        expect(Collection.from([1, 2, 3]).drop(2).toArray()).toEqual([3]);
        expect(Collection.from([1, 2, 3]).drop(3).toArray()).toEqual([]);
    });

    test("cons", () => {
        expect(Collection.from([1, 2, 3, 4]).pairwise().toArray()).toEqual([
            [1, 2],
            [2, 3],
            [3, 4],
        ]);
    });

    test("zipLongest", () => {
        expect(
            Collection.from([1, 2, 3])
                .zipLongest(Collection.from(["a", "b"]))
                .toArray()
        ).toEqual([
            [1, "a"],
            [2, "b"],
            [3, undefined],
        ]);
    });

    test("zip", () => {
        const zipped = Collection.from([1, 2, 3]).zip(Collection.from(["a", "b"]));

        assertType<Collection<readonly [number, string]>>(zipped);
        expect(zipped.toArray()).toEqual([
            [1, "a"],
            [2, "b"],
        ]);
    });

    test("prepend", () => {
        expect(Collection.from([2, 3]).prepend(1).toArray()).toEqual([1, 2, 3]);
    });

    test("groupBy", () => {
        const values = Collection.from([1, 2, 3]).groupBy(x => x > 1);

        expect(values.size).toEqual(2);
        expect(values.get(false)?.toArray()).toEqual([1]);
        expect(values.get(true)?.toArray()).toEqual([2, 3]);
    });

    test("toHashMap from pairs", () => {
        const hashMap = Collection.from([1, 2]).toHashMap(x => [x, x.toString()]);

        expect(hashMap.size).toEqual(2);
        expect(hashMap.get(1)).toEqual("1");
        expect(hashMap.get(2)).toEqual("2");
    });
});
