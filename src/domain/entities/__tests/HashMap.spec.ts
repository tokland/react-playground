import { HashMap } from "../HashMap";

test("empty", () => {
    const map = HashMap.empty();
    expect(map.size).toEqual(0);
});

test("set and get values", () => {
    const map = HashMap.empty<number, string>().set(0, "a").set(1, "b");

    expect(map.size).toEqual(2);
    expect(map.get(0)).toEqual("a");
    expect(map.get(1)).toEqual("b");
    expect(map.get(2)).toBeUndefined();
});
