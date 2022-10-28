export type IsEqual<T1, T2> = [T1] extends [T2] ? ([T2] extends [T1] ? true : false) : false;

export const assertEqualTypes = <T1, T2>(_eq: IsEqual<T1, T2>): void => {};

export const assertType = <T>(_value: T): void => {};
