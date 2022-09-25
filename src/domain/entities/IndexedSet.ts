import { Maybe } from "../../libs/ts-utils";
import { HashMap as RimbuHashMap } from "@rimbu/hashed";

type Hash = string | number;
type GetKey<V> = (set: IndexedSet<V>) => Hash;

export class IndexedSet<V> {
    private constructor(private hashMap: RimbuHashMap<Hash, V>, private getKey: GetKey<V>) {}

    get(key: Hash): Maybe<V> {
        return this.hashMap.get(key);
    }

    add(value: V): IndexedSet<V> {
        const key = this.getKey(this);
        const updated = this.hashMap.set(key, value);
        return new IndexedSet(updated, this.getKey);
    }

    get size(): number {
        return this.hashMap.size;
    }

    static empty<V>(getKey: GetKey<V>): IndexedSet<V> {
        return new IndexedSet(RimbuHashMap.empty(), getKey);
    }
}
