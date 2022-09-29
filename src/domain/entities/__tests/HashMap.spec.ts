import { HashMap } from "../HashMap";

describe("constructors", () => {
    test("empty", () => {
        const map = HashMap.empty();
        expect(map.size).toEqual(0);
    });

    test("fromPairs", () => {
        const map = HashMap.fromPairs([
            ["a", 1],
            ["b", 2],
        ]);

        expect(map.size).toEqual(2);
        expect(map.get("a")).toEqual(1);
        expect(map.get("b")).toEqual(2);
    });
});

describe("set", () => {
    test("returns values if present", () => {
        const map = HashMap.empty<number, string>().set(0, "a").set(1, "b");

        expect(map.get(0)).toEqual("a");
        expect(map.get(1)).toEqual("b");
    });

    test("returns undefined if not present", () => {
        const map = HashMap.empty<number, string>().set(0, "a").set(1, "b");

        expect(map.get(2)).toBeUndefined();
    });
});
