import { Counter } from "../Counter";

const counter = new Counter({ id: "c1", value: 1 });

describe("attributes", () => {
    it("are readable", () => {
        expect(counter.id).toEqual("c1");
        expect(counter.value).toEqual(1);
    });
});

describe("actions", () => {
    it("has updatable value", () => {
        const counter2 = counter.add(3);
        expect(counter2.value).toEqual(4);
    });
});
