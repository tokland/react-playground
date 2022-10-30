export function Struct<Attributes>() {
    abstract class BaseClass {
        constructor(_attributes: Attributes) {
            Object.assign(this, _attributes);
        }

        protected _update(partialAttrs: Partial<Attributes>): this {
            const ParentClass = this.constructor as new (values: Attributes) => typeof this;
            return new ParentClass({ ...this, ...partialAttrs } as unknown as Attributes);
        }

        static create<U extends BaseClass>(
            this: new (values: Attributes) => U,
            attributes: Attributes
        ): U {
            return new this(attributes);
        }
    }

    return BaseClass as {
        new (values: Attributes): Attributes & BaseClass;
        create: typeof BaseClass["create"];
    };
}
