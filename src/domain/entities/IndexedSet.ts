import { Maybe } from "../../libs/ts-utils";
import { HashMap as RimbuHashMap } from "@rimbu/hashed";

type Hash = string | number;

type getHash<T> = (set: IndexedSet<T>) => Hash;

export class IndexedSet<T> {
    private constructor(private hashMap: RimbuHashMap<Hash, T>, private getKey: getHash<T>) {}

    get(hash: Hash): Maybe<T> {
        return this.hashMap.get(hash);
    }

    add(value: T): IndexedSet<T> {
        const key = this.getKey(this);
        const updated = this.hashMap.set(key, value);
        return new IndexedSet(updated, this.getKey);
    }

    get size(): number {
        return this.hashMap.size;
    }

    static empty<V>(getHash: getHash<V>): IndexedSet<V> {
        return new IndexedSet(RimbuHashMap.empty(), getHash);
    }
}
