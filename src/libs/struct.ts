export function Struct<T>() {
    class BaseClass {
        constructor(private _values: T) {
            Object.assign(this, this._values);
        }

        update(state: Partial<T>): this {
            const ParentClass = this.constructor as new (values: T) => typeof this;
            return new ParentClass({ ...this._values, ...state });
        }
    }

    return BaseClass as new (values: T) => T & BaseClass;
}
