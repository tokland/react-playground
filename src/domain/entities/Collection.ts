import { HashMap } from "./HashMap";

export default function _c<T>(xs: T[]): Collection<T> {
    return Collection.from(xs);
}

export class Collection<T> {
    private xs: T[];

    protected constructor(values: T[]) {
        this.xs = values;
    }

    /* Builders */

    static from<T>(xs: T[]): Collection<T> {
        return new Collection(xs);
    }

    static range(start: number, end: number, step = 1): Collection<number> {
        const output = [];
        for (let idx = start; idx < end; idx = idx + step) output.push(idx);
        return Collection.from(output);
    }

    /* Unwrappers */

    value(): T[] {
        return this.xs;
    }

    toArray = this.value;

    get size() {
        return this.xs.length;
    }

    /* Methods that return a Collection */

    map<U>(fn: (x: T) => U): Collection<U> {
        return _c(this.xs.map(fn));
    }

    flatten(): T extends Array<infer U> ? Collection<U> : never {
        return _c(this.xs.flat()) as any;
    }

    flatMap<U>(fn: (x: T) => Collection<U>): Collection<U> {
        return _c(this.xs.flatMap(x => fn(x).toArray()));
    }

    select(pred: (x: T) => boolean): Collection<T> {
        return _c(this.xs.filter(pred));
    }

    filter = this.select;

    reject(pred: (x: T) => boolean): Collection<T> {
        return _c(this.xs.filter(x => !pred(x)));
    }

    enumerate(): Collection<[number, T]> {
        return _c(this.xs.map((x, idx) => [idx, x]));
    }

    compact(): Collection<NonNullable<T>> {
        return this.reject(x => x === undefined || x === null) as Collection<NonNullable<T>>;
    }

    compactMap<U>(fn: (x: T) => U | undefined | null): Collection<U> {
        return this.map(fn).compact();
    }

    append(x: T): Collection<T> {
        return _c(this.xs.concat([x]));
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
        return _c(this.xs.slice().sort(defaultCompareFn));
    }

    sortBy<U>(fn: (x: T) => U, options: { compareFn?: CompareFn<U> } = {}): Collection<T> {
        const compareFn = options.compareFn || defaultCompareFn;
        // TODO: Schwartzian transform: decorate + sort tuple + undecorate
        return _c(this.xs.slice().sort((a, b) => compareFn(fn(a), fn(b))));
    }

    sortWith(compareFn: CompareFn<T>): Collection<T> {
        return _c(this.xs.slice().sort(compareFn));
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
        return _c(this.xs.slice(0, n));
    }

    drop(n: number): Collection<T> {
        return _c(this.xs.slice(n));
    }

    pairwise(): Collection<[T, T]> {
        const n = 2;

        return _c(
            this.xs
                .slice(0, this.xs.length - n + 1)
                .map((_x, idx) => [this.xs[idx], this.xs[idx + 1]] as [T, T])
        );
    }

    prepend(x: T) {
        return _c([x, ...this.xs]);
    }

    tap(fn: (xs: Collection<T>) => void) {
        fn(this);
        return this;
    }

    splitAt(indexes: number[]): Collection<Collection<T>> {
        return _c(indexes)
            .prepend(0)
            .append(this.xs.length)
            .pairwise()
            .map(([i1, i2]) => _c(this.xs.slice(i1, i2)));
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
        return _c(idxs.map(idx => this.xs[idx]));
    }

    intersperse(value: T): Collection<T> {
        return this.flatMap(x => _c([x, value])).thru(cs => cs.take(cs.size - 1));
    }

    uniq(): Collection<T> {
        return this.uniqBy(x => x);
    }

    uniqBy<U>(mapper: (value: T) => U): Collection<T> {
        const seen = new Set<U>();
        const output: Array<T> = [];

        for (const item of this.xs) {
            const mapped = mapper(item);
            if (!seen.has(mapped)) {
                output.push(item);
                seen.add(mapped);
            }
        }

        return Collection.from(output);
    }

    reduce<U>(mapper: (acc: U, value: T) => U, initialAcc: U): U {
        return this.xs.reduce(mapper, initialAcc);
    }

    chunk(size: number): Collection<T[]> {
        return Collection.range(0, this.xs.length, size).map(index =>
            this.xs.slice(index, index + size)
        );
    }

    // cartesian
    // orderBy([[x => x+1, "asc"], [x => 2*x, "desc"]])
    // forEach(fn: (value: T) => void): void

    zipLongest<S>(xs: Collection<S>): Collection<[T | undefined, S | undefined]> {
        const max = Math.max(this.size, xs.size);
        const pairs = Collection.range(0, max)
            .map(i => [this.xs[i], xs.xs[i]] as [T | undefined, S | undefined])
            .value();
        return _c(pairs);
    }

    zip<S>(xs: Collection<S>): Collection<[T, S]> {
        const min = Math.min(this.size, xs.size);
        const pairs = Collection.range(0, min)
            .map(i => [this.xs[i], xs.xs[i]] as [T, S])
            .value();
        return _c(pairs);
    }

    /* Methods that return HashMap */

    indexBy<U>(grouperFn: (x: T) => U): HashMap<U, T> {
        const initialValue = HashMap.empty<U, T>();

        return this.reduce((acc, x) => {
            const key = grouperFn(x);
            return acc.set(key, x);
        }, initialValue);
    }

    keyBy = this.indexBy;

    groupBy<U>(grouperFn: (x: T) => U): HashMap<U, Collection<T>> {
        const initialValue = HashMap.empty<U, Collection<T>>();

        return this.reduce((acc, x) => {
            const key = grouperFn(x);
            const valuesForKey = acc.get(key) || _c([]);
            return acc.set(key, valuesForKey.append(x));
        }, initialValue);
    }

    groupFromMap<U, W>(grouperFn: (x: T) => [U, W]): HashMap<U, Collection<W>> {
        const initialValue = HashMap.empty<U, Collection<W>>();

        return this.reduce((acc, x) => {
            const [key, value] = grouperFn(x);
            const valuesForKey = acc.get(key) || _c([]);
            return acc.set(key, valuesForKey.append(value));
        }, initialValue);
    }

    toHashMap<K, V>(toPairFn: (x: T) => [K, V]): HashMap<K, V> {
        const pairs = this.map(toPairFn).toArray();
        return HashMap.fromPairs(pairs);
    }
}

type CompareRes = -1 | 0 | 1;

export type CompareFn<T> = (a: T, b: T) => CompareRes;

function defaultCompareFn<T>(a: T, b: T): CompareRes {
    return a > b ? 1 : a === b ? 0 : -1;
}
