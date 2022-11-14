import _ from "lodash";
import { HashMap } from "./HashMap";

export class Collection<T> {
    private xs: T[];

    constructor(values: T[]) {
        this.xs = values;
    }

    /* Constructors */

    static from<T>(xs: T[]): Collection<T> {
        return new Collection(xs);
    }

    static range(start: number, end: number): Collection<number> {
        return build(Array.from(new Array(end - start)).map((_x, idx) => start + idx));
    }

    /* Unwrappers */

    value(): T[] {
        return this.xs;
    }

    toArray = this.value;

    /* Methods that return a Collection */

    get size() {
        return this.xs.length;
    }

    map<U>(fn: (x: T) => U): Collection<U> {
        return build(this.xs.map(fn));
    }

    flatten(): T extends Array<infer U> ? Collection<U> : never {
        return build(this.xs.flat()) as any;
    }

    flatMap<U>(fn: (x: T) => Collection<U>): Collection<U> {
        return new Collection(this.xs.flatMap(x => fn(x).toArray()));
    }

    select(pred: (x: T) => boolean): Collection<T> {
        return new Collection(this.xs.filter(pred));
    }

    filter = this.select;

    reject(pred: (x: T) => boolean): Collection<T> {
        return build(this.xs.filter(x => !pred(x)));
    }

    enumerate(): Collection<[number, T]> {
        return build(this.xs.map((x, idx) => [idx, x]));
    }

    compact(): Collection<NonNullable<T>> {
        return this.reject(x => x === undefined || x === null) as Collection<NonNullable<T>>;
    }

    compactMap<C extends Collection<T>, U>(this: C, fn: (x: T) => U): Collection<NonNullable<U>> {
        return this.map(fn).compact() as Collection<NonNullable<U>>;
    }

    append(x: T): Collection<T> {
        return build(this.xs.concat([x]));
    }

    includes(x: T): boolean {
        return this.xs.includes(x);
    }

    every(pred: (x: T) => boolean): boolean {
        return this.xs.every(pred);
    }

    all = this.every;

    some(pred: (x: T) => boolean): boolean {
        return this.xs.some(pred);
    }

    any = this.some;

    find<Or extends T | undefined>(pred: (x: T) => boolean, options: { or?: Or } = {}): T | Or {
        return this.xs.find(pred) || (options?.or as Or);
    }

    sort(): Collection<T> {
        return build(this.xs.slice().sort(defaultCompareFn));
    }

    sortBy<U>(fn: (x: T) => U, options: { compareFn?: CompareFn<U> } = {}): Collection<T> {
        const compareFn = options.compareFn || defaultCompareFn;
        // TODO: Schwartzian transform: decorate + sort tuple + undecorate
        return build(this.xs.slice().sort((a, b) => compareFn(fn(a), fn(b))));
    }

    sortWith(compareFn: CompareFn<T>): Collection<T> {
        return build(this.xs.slice().sort((a, b) => compareFn(a, b)));
    }

    first(): T | undefined {
        return this.xs[0];
    }

    last(): T | undefined {
        return this.xs[this.xs.length - 1];
    }

    sum(): number {
        return this.xs.reduce((acc, x) => acc + Number(x), 0);
    }

    take(n: number): Collection<T> {
        return build(this.xs.slice(0, n));
    }

    drop(n: number): Collection<T> {
        return build(this.xs.slice(n));
    }

    pairwise(): Collection<[T, T]> {
        const n = 2;

        return build(
            this.xs
                .slice(0, this.xs.length - n + 1)
                .map((_x, idx) => [this.xs[idx]!, this.xs[idx + 1]!])
        );
    }

    prepend(x: T): this {
        return build([x, ...this.xs]) as this;
    }

    tap(fn: (xs: Collection<T>) => void): this {
        fn(this);
        return this;
    }

    splitAt(indexes: number[]): Collection<Collection<T>> {
        return build(indexes)
            .prepend(0)
            .append(this.xs.length)
            .pairwise()
            .map(([i1, i2]) => build(this.xs.slice(i1, i2)));
    }

    thru<U>(fn: (xs: Collection<T>) => Collection<U>) {
        return fn(this);
    }

    join(char: string): string {
        return this.xs.join(char);
    }

    get(idx: number): T | undefined {
        return this.xs[idx];
    }

    getMany(idxs: number[]): Collection<T | undefined> {
        return build(idxs.map(idx => this.xs[idx]));
    }

    intersperse(value: T): Collection<T> {
        return this.flatMap(x => build([x, value])).thru(cs => cs.take(cs.size - 1));
    }

    // forEach
    // uniq
    // uniqBy
    // reduce
    // accumulate
    // cartesianProduct
    // orderBy([[x => x+1, "asc"], [x => 2*x, "desc"]])

    zipLongest<S>(xs: Collection<S>): Collection<readonly [T | undefined, S | undefined]> {
        const max = Math.max(this.size, xs.size);
        const pairs = _.range(0, max).map(i => [this.xs[i], xs.xs[i]] as const);
        return build(pairs);
    }

    zip<S>(xs: Collection<S>): Collection<readonly [T, S]> {
        const min = Math.min(this.size, xs.size);
        const pairs = _.range(0, min).map(i => [this.xs[i], xs.xs[i]] as [T, S]);
        return build(pairs);
    }

    /* Methods that return: HashMap */

    // keyBy / indexBy

    groupBy<U>(grouperFn: (x: T) => U): HashMap<U, Collection<T>> {
        const initialValue = HashMap.empty<U, Collection<T>>();

        return this.xs.reduce((hashMapAcc, x) => {
            const key = grouperFn(x);
            const valuesForKey = hashMapAcc.get(key) || new Collection([]);
            return hashMapAcc.set(key, valuesForKey.append(x));
        }, initialValue);
    }

    toHashMap<K, V>(toPairFn: (x: T) => [K, V]): HashMap<K, V> {
        const pairs = this.map(toPairFn).toArray();
        return HashMap.fromPairs(pairs);
    }
}

function build<T>(xs: T[]): Collection<T> {
    return Collection.from(xs);
}

type CompareRes = -1 | 0 | 1;

export type CompareFn<T> = (a: T, b: T) => CompareRes;

function defaultCompareFn<T>(a: T, b: T): CompareRes {
    return a > b ? 1 : a === b ? 0 : -1;
}
