/* Types */

export type Maybe<T> = T | undefined;

export type Expand<T> = {} & { [P in keyof T]: T[P] };

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/* Functions */

export function assertUnreachable(_value: never): never {
    throw new Error();
}
