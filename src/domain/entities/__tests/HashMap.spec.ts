import { HashMap } from "../HashMap";

const mapAbc123 = HashMap.fromPairs([
    ["a", 1],
    ["b", 2],
    ["c", 3],
]);

describe("constructors", () => {
    test("empty", () => {
        const map = HashMap.empty();
        expect(map.size).toEqual(0);
        expect(map.toPairs()).toEqual([]);
    });

    test("fromPairs", () => {
        const map = HashMap.fromPairs([
            ["a", 1],
            ["b", 2],
        ]);

        expect(map.size).toEqual(2);
        expect(map.toPairs()).toEqual([
            ["a", 1],
            ["b", 2],
        ]);
    });
});

describe("conversors", () => {
    test("toCollection", () => {
        expect(mapAbc123.toCollection().toArray()).toEqual([
            ["a", 1],
            ["b", 2],
            ["c", 3],
        ]);
    });
});

describe("key/value inclusion", () => {
    test("hasKey", () => {
        expect(mapAbc123.hasKey("b")).toBe(true);
        expect(mapAbc123.hasKey("d")).toBe(false);
    });
});

describe("get", () => {
    test("returns value if present", () => {
        expect(mapAbc123.get("a")).toEqual(1);
        expect(mapAbc123.get("b")).toEqual(2);
    });

    test("returns undefined if not present", () => {
        expect(mapAbc123.get("d")).toBeUndefined();
    });
});

describe("transforms", () => {
    test("invert", () => {
        expect(mapAbc123.invert().toPairs()).toEqual([
            [1, "a"],
            [2, "b"],
            [3, "c"],
        ]);
    });

    test("invertMulti", () => {
        const mapAbc122 = HashMap.fromPairs([
            ["a", 1],
            ["b", 2],
            ["c", 2],
        ]);

        expect(mapAbc122.invertMulti().toPairs()).toEqual([
            [1, ["a"]],
            [2, ["b", "c"]],
        ]);
    });
});

describe("filtering by key or value", () => {
    test("pick", () => {
        expect(mapAbc123.pick(["a", "c"]).toPairs()).toEqual([
            ["a", 1],
            ["c", 3],
        ]);
    });

    test("pickBy", () => {
        expect(mapAbc123.pickBy(([k, v]) => k !== "b" && v > 2).toPairs()).toEqual([["c", 3]]);
    });

    test("omit", () => {
        expect(mapAbc123.omit(["a", "c"]).toPairs()).toEqual([["b", 2]]);
    });

    test("omitBy", () => {
        expect(mapAbc123.omitBy(([k, v]) => k == "b" || v === 1).toPairs()).toEqual([["c", 3]]);
    });
});
