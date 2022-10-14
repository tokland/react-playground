import { AppState, AppStateAttrs, Loader } from "../AppState";
import { Counter } from "../Counter";
import { HashMap } from "../HashMap";

const attrs1: AppStateAttrs = {
    page: { type: "home" },
    session: { type: "unauthenticated" },
    counters: HashMap.empty(),
};

const attrs2: AppStateAttrs = {
    page: { type: "counter", id: "c1" },
    session: { type: "loggedIn", username: "test" },
    counters: attrs1.counters.set("c1", { status: "loading" }),
};

const state1 = new AppState(attrs1);
const state2 = new AppState(attrs2);

describe("attributes", () => {
    it("are readable", () => {
        expect(state1.page).toEqual({ type: "home" });
        expect(state1.session).toEqual({ type: "unauthenticated" });
        expect(state1.counters.size).toEqual(0);
    });
});

describe("update", () => {
    it("can be updated from full attributes", () => {
        const state2 = state1.update(attrs2);

        expect(state1.page).toEqual({ type: "home" });
        expect(state1.session).toEqual({ type: "unauthenticated" });
        expect(state1.counters.size).toEqual(0);

        expect(state2.page).toEqual({ type: "counter", id: "c1" });
        expect(state2.session).toEqual({ type: "loggedIn", username: "test" });
        expect(state2.counters.size).toEqual(1);
        expect(state2.counters.get("c1")).toEqual({ status: "loading" });
    });
});

describe("loggedUserName", () => {
    it("returns username of logged user", () => {
        expect(state1.loggedUsername).toBeUndefined();
        expect(state2.loggedUsername).toEqual("test");
    });

    it("returns username of logged user", () => {
        expect(
            state1.update({ session: { type: "unauthenticated" } }).loggedUsername
        ).toBeUndefined();
        expect(state2.loggedUsername).toEqual("test");
    });
});

describe("currentCounter", () => {
    it("returns the current page counter (loader and value) for empty values", () => {
        const state2 = state1.update({
            page: { type: "counter", id: "c1" },
            counters: state1.counters.set("c1", { status: "loading" }),
        });

        expect(state2.currentCounter).toEqual({
            loader: { status: "loading" },
            counter: undefined,
        });
    });

    it("returns the current page counter (loader and value)", () => {
        const counter = new Counter({ id: "c1", value: 1 });
        const loader: Loader<Counter> = { status: "loaded", value: counter, isUpdating: false };

        const state2 = state1.update({
            page: { type: "counter", id: "c1" },
            counters: state1.counters.set("c1", loader),
        });

        expect(state2.currentCounter).toEqual({ loader, counter });
    });
});

describe("counterIdFromIndex", () => {
    it("returns no value from unauthenticated session", () => {
        const state2 = state1.update({
            session: { type: "unauthenticated" },
        });
        expect(state2.counterIdFromIndex(1)).toEqual(undefined);
    });

    it("returns concatenation of logged username and index", () => {
        const state2 = state1.update({
            session: { type: "loggedIn", username: "test" },
        });
        expect(state2.counterIdFromIndex(1)).toEqual(`test-1`);
    });
});
