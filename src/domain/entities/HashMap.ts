import { HashMap as RimbuHashMap } from "@rimbu/hashed";
import { Maybe } from "../../libs/ts-utils";

class HashMapB<K, V> {
    protected constructor(protected _map: RimbuHashMap<K, V>) {}

    static empty<K, V>() {
        return new HashMapB<K, V>(RimbuHashMap.empty());
    }
}

// extends HashMapBase<K, V>()
export class HashMap<K, V> extends HashMapB<K, V> {
    /* Constructors */

    static fromPairs<K, V>(pairs: Array<[K, V]>) {
        return new HashMap(RimbuHashMap.from(pairs));
    }

    /* Method */

    get(key: K): Maybe<V> {
        return this._map.get(key);
    }

    set(key: K, value: V): HashMap<K, V> {
        const updated = this._map.set(key, value);
        return new HashMap(updated);
    }

    equals(map: HashMap<K, V>): boolean {
        const mapsHaveEqualSize = () => this.size === map.size;
        const allValuesEqual = () => this._map.streamKeys().every(k => this.get(k) === map.get(k));
        return mapsHaveEqualSize() && allValuesEqual();
    }

    keys(): K[] {
        return this._map.streamKeys().toArray();
    }

    values(): V[] {
        return this._map.streamValues().toArray();
    }

    toPairs(): Array<readonly [K, V]> {
        return this._map.toArray();
    }

    get size(): number {
        return this._map.size;
    }

    // pickBy
    // omitBy
    // invert
    // invertAsCollection
    // hasKey
    // merge
    // mergeWith
    // forEach
}
