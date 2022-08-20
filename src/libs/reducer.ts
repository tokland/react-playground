import _ from "lodash";

export function buildReducer<State>() {
    return function <Obj extends Record<string, Action<State> | BuildReducer<any>>>(obj: Obj) {
        const actionKeys: Array<keyof Obj> = _(obj)
            .toPairs()
            .map(([key, value]) => (typeof value === "function" ? key : null))
            .compact()
            .value();

        return {
            actions: _.pick(obj, actionKeys),
            nested: _.omit(obj, actionKeys),
        } as unknown as BuildReducerFromMixedObj<State, Obj>;
    };
}

type BaseObj<State> = Record<string, Action<State> | BuildReducer<any>>;

type BuildReducerFromMixedObj<State, Obj extends BaseObj<State>> = {
    actions: Get<Obj, Action<State>>;
    nested: Get<Obj, BuildReducer<any>>;
};

type Id<T> = { [K in keyof T]: T[K] } | never;

type Get<T, S> = Id<Pick<T, { [K in keyof T]: T[K] extends S ? K : never }[keyof T]>>;

export type Action<State> = (...args: any[]) => (state: State) => State;

type ActionsBase<State> = Record<string, Action<State>>;

type NestedBase<State> = { [K in keyof State]?: BuildReducer<State[K]> };

export interface BuildReducer<State> {
    actions: ActionsBase<State>;
    nested: NestedBase<State>;
}
