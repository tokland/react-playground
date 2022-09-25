import { Maybe } from "../../libs/ts-utils";
import { HashMap as RimbuHashMap } from "@rimbu/hashed";

type Id = string;
type Ref = { id: Id };

export class IndexedSet<V extends Ref> {
    private constructor(private _map: RimbuHashMap<string, V>) {}

    get(key: Id): Maybe<V> {
        return this._map.get(key);
    }

    set(value: V): IndexedSet<V> {
        const key = value.id;
        const updated = this._map.set(key, value);
        return new IndexedSet(updated);
    }

    get size(): number {
        return this._map.size;
    }

    static empty<V extends Ref>(): IndexedSet<V> {
        return new IndexedSet(RimbuHashMap.empty());
    }
}
