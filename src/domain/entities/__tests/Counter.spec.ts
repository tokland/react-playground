import { Counter } from "../Counter";

const counter = new Counter({ id: "c1", value: 1 });

it("has readable attributes", () => {
    expect(counter.id).toEqual("c1");
    expect(counter.value).toEqual(1);
});

it("can be updated from full attributes", () => {
    const counter2 = counter._update({ id: "c2", value: 2 });

    expect(counter.id).toEqual("c1");
    expect(counter.value).toEqual(1);

    expect(counter2.id).toEqual("c2");
    expect(counter2.value).toEqual(2);
});

it("can be updated from partial attributes", () => {
    const counter2 = counter._update({ value: 2 });
    expect(counter2.id).toEqual("c1");
    expect(counter2.value).toEqual(2);
});

it("has add", () => {
    const counter2 = counter.add(3);

    expect(counter.value).toEqual(1);
    expect(counter2.id).toEqual("c1");
    expect(counter2.value).toEqual(4);
});
