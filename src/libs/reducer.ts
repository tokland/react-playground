import _ from "lodash";

type GetUpdaterMethods<T> = {
    [P in keyof T]: T[P] extends (...args: any[]) => T ? P : never;
}[keyof T];

type ReducerOf<T> = {
    [K in keyof T]: T[K] extends (...args: infer Args) => T
        ? (...args: Args) => (obj: T) => T
        : never;
};

export function buildReducer<T>(
    ctor: new (...args: any[]) => T
): Pick<ReducerOf<T>, GetUpdaterMethods<T>> {
    const properties = Object.getOwnPropertyNames(ctor.prototype);

    return _(properties)
        .map(property => {
            function fn(...args: any[]) {
                return (obj: T) => (obj as any)[property].bind(obj)(...args);
            }
            return [property, fn] as const;
        })
        .fromPairs()
        .value() as ReducerOf<T>;
}

/*
const counter1 = new Counter({ id: "1", value: 1 });
const counter$ = buildReducer(Counter);
const counter2 = counter$.add(1)(counter1);
console.log(counter2);
*/
