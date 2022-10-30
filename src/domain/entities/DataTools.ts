import _ from "lodash";
import { HashMap } from "./HashMap";

type Opt<Args extends any[], K extends string> = Args extends [{ or: infer O }] ? O : undefined;
type T1 = Opt<[], "a">;
type T2 = Opt<[{ or: 2 }], "a">;

export class Collection<T> {
    private xs: T[];

    constructor(values: T[]) {
        this.xs = values;
    }

    /* Constructors */

    static from2<T>(xs: T[]) {
        return new this(xs);
    }

    // static range(start: number, end: number)

    /* Methods that return a Collection */

    get size() {
        return this.xs.length;
    }

    map<U>(fn: (x: T) => U): Collection<U> {
        return build(this.xs.map(fn));
    }

    flatMap<U>(fn: (x: T) => Collection<U>): Collection<U> {
        return new Collection(this.xs.flatMap(x => fn(x).toArray()));
    }

    select(pred: (x: T) => boolean): Collection<T> {
        return new Collection(this.xs.filter(pred));
    }

    filter = this.select;

    reject(pred: (x: T) => boolean): Collection<T> {
        return new Collection(this.xs.filter(x => !pred(x)));
    }

    enumerate(): Collection<[number, T]> {
        return new Collection(this.xs.map((x, idx) => [idx, x]));
    }

    compact(): Collection<NonNullable<T>> {
        return this.reject(x => x === undefined || x === null) as Collection<NonNullable<T>>;
    }

    compactMap<U>(fn: (x: T) => U): Collection<NonNullable<U>> {
        return this.map(fn).compact();
    }

    append(x: T): Collection<T> {
        return new Collection(this.xs.concat([x]));
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
        return new Collection(this.xs.slice().sort(defaultCompareFn));
    }

    sortBy<U>(fn: (x: T) => U, options: { compareFn?: CompareFn<U> } = {}): Collection<T> {
        const compareFn = options.compareFn || defaultCompareFn;
        return build(this.xs.slice().sort((a, b) => compareFn(fn(a), fn(b))));
    }

    sortWith(compareFn: CompareFn<T>): Collection<T> {
        return new Collection(this.xs.slice().sort((a, b) => compareFn(a, b)));
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
        return new Collection(this.xs.slice(0, n));
    }

    drop(n: number): Collection<T> {
        return new Collection(this.xs.slice(n));
    }

    pairwise(): Collection<[T, T]> {
        const n = 2;

        return build(
            this.xs
                .slice(0, this.xs.length - n + 1)
                .map((_x, idx) => [this.xs[idx]!, this.xs[idx + 1]!])
        );
    }

    prepend(x: T): Collection<T> {
        return build([x, ...this.xs]);
    }

    tap(fn: (xs: Collection<T>) => void) {
        fn(this);
        return this;
    }

    splitAt(idx: number[]): Collection<Collection<T>> {
        return build(idx)
            .prepend(0)
            .append(this.xs.length)
            .pairwise()
            .map(([i1, i2]) => build(this.xs.slice(i1, i2)));
    }

    thru<U>(fn: (xs: Collection<T>) => Collection<U>) {
        return fn(this);
    }

    /*
    splitWhen(pred: (x: T) => boolean): Collection<Collection<T>> {
        return this.enumerate()
            .compactMap(([idx, x]) => (pred(x) ? idx + 1 : undefined))
            .thru(indexes => this.splitAt(indexes.value()));
    }
    */

    join(char: string): string {
        return this.xs.join(char);
    }

    get(idx: number): T | undefined {
        return this.xs[idx];
    }

    getMany(idxs: number[]): Collection<T | undefined> {
        return build(idxs.map(idx => this.xs[idx]));
    }

    // splitAtIndexes
    // intersperse
    // forEach
    // uniq
    // uniqBy
    // reduce
    // accumulate
    // cartesianProduct
    // orderBy([[x => x+1, "asc"], [x => 2*x, "desc"]])

    value(): T[] {
        return this.xs;
    }

    toArray = this.value;

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

type CompareRes = -1 | 0 | 1;

export type CompareFn<A> = (a: A, b: A) => CompareRes;

function defaultCompareFn<A>(a: A, b: A): CompareRes {
    return a > b ? 1 : a === b ? 0 : -1;
}

function build<T>(xs: T[]): Collection<T> {
    return new Collection(xs);
}
