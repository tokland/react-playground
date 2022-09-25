import { Maybe } from "../../libs/ts-utils";
import { HashMap as RimbuHashMap } from "@rimbu/hashed";

export class HashMap<K, V> {
    private constructor(private _map: RimbuHashMap<K, V>) {}

    get(key: K): Maybe<V> {
        return this._map.get(key);
    }

    set(key: K, value: V): HashMap<K, V> {
        const updated = this._map.set(key, value);
        return new HashMap(updated);
    }

    get size(): number {
        return this._map.size;
    }

    static empty<K, V>(): HashMap<K, V> {
        return new HashMap(RimbuHashMap.empty());
    }
}