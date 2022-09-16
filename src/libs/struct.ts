export function Struct<T>() {
    class BaseClass {
        constructor(private _values: T) {
            Object.assign(this, this._values);
        }

        protected _update(partialAttrs: Partial<T>): this {
            const ParentClass = this.constructor as new (values: T) => typeof this;
            return new ParentClass({ ...this._values, ...partialAttrs });
        }
    }

    return BaseClass as new (values: T) => T & BaseClass;
}
