import _ from "lodash";

type GetUpdaterMethods<T> = {
    [P in keyof T]: T[P] extends (...args: any[]) => T ? P : never;
}[keyof T];

type ReducerAll<T> = {
    [K in keyof T]: T[K] extends (...args: infer Args) => T
        ? (...args: Args) => (obj: T) => T
        : never;
};

type Reducer<T> = Pick<ReducerAll<T>, GetUpdaterMethods<T>>;

export function buildReducer<T>(ctor: new (...args: any[]) => T): Reducer<T> {
    const properties = Object.getOwnPropertyNames(ctor.prototype);

    return _(properties)
        .map(property => {
            function fn(...args: any[]) {
                return (obj: T) => (obj as any)[property].bind(obj)(...args);
            }
            return [property, fn] as const;
        })
        .fromPairs()
        .value() as ReducerAll<T>;
}
