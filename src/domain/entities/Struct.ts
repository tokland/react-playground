export function Struct<Attributes>() {
    class BaseClass {
        constructor(_attributes: Attributes) {
            Object.assign(this, _attributes);
        }

        protected _update(partialAttrs: Partial<Attributes>): this {
            const ParentClass = this.constructor as new (values: Attributes) => typeof this;
            return new ParentClass({ ...this, ...partialAttrs } as unknown as Attributes);
        }
    }

    return BaseClass as {
        new (values: Attributes): Attributes & BaseClass;
    };
}
