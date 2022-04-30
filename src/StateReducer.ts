import _ from "lodash";

/* Generic */

type Intersect<T1, T2> = T1 & T2;

type Expand<T> = T extends infer T2 ? { [K in keyof T2]: T2[K] } : never;

function getMethods<T>(ctor: new (...args: any) => T): string[] {
    const methods = [];
    do {
        methods.push(...Object.getOwnPropertyNames(ctor.prototype));
        methods.push(...Object.getOwnPropertyNames(new ctor({})));
        ctor = Object.getPrototypeOf(ctor);
    } while (ctor.prototype);

    return _(methods).without("constructor", "state").uniq().value();
}

/* Reducers */

abstract class BaseReducer<State> {
    constructor(protected state: State) {}
}

export type IReducer<Reducer> = Record<keyof Reducer, (...args: any[]) => GetState<Reducer>>;

type GetState<Reducer_> = Reducer_ extends BaseReducer<infer State> ? State & {} : never;

type NestedReducers<State> = Partial<Record<keyof State, any>>;

interface ReducerCtor<State, Reducer> {
    new (state: State): Reducer;
    nested?: NestedReducers<State>;
}

type GetCtorReducer<Ctor extends new (...args: any) => any> = InstanceType<Ctor>;

type GetCtorState<Ctor extends new (...args: any) => any> = GetState<GetCtorReducer<Ctor>>;

/* Actions */

export type Action<State> = { update: (state: State) => State };

type GetActions<
    MainState,
    Reducer,
    Nest extends NestedReducers<GetState<Reducer>> | undefined
> = Intersect<
    {
        [Method in keyof Reducer]: Reducer[Method] extends (
            ...args: infer Args
        ) => GetState<Reducer>
            ? (...args: Args) => Action<MainState>
            : never;
    },
    {
        [K in keyof Nest & keyof GetState<Reducer>]: Expand<
            GetActions<MainState, GetCtorReducer<Nest[K]>, Nest[K]["nested"]>
        >;
    }
>;

type UpdateUpdater<MainState, State> = (
    mainState: MainState,
    mapper: (state: State) => State
) => MainState;

function getActions<Ctor extends ReducerCtor<GetCtorState<Ctor>, IReducer<GetCtorReducer<Ctor>>>>(
    reducerCtor: Ctor
) {
    type MainState = GetCtorState<Ctor>;
    return getActionsWithMapper<MainState, Ctor>(reducerCtor, (state, mapper) => mapper(state));
}

function getActionsWithMapper<
    MainState,
    Ctor extends ReducerCtor<GetCtorState<Ctor>, IReducer<GetCtorReducer<Ctor>>>
>(
    reducerCtor: Ctor,
    stateUpdater: UpdateUpdater<MainState, GetCtorState<Ctor>>
): Expand<GetActions<MainState, GetCtorReducer<Ctor>, Ctor["nested"]>> {
    type Reducer = GetCtorReducer<Ctor>;
    type State = GetCtorState<Ctor>;
    type Nested = typeof reducerCtor.nested;
    type NestedKey = keyof Nested & keyof State;

    // reducer.method(arg1, arg2).update(state);
    const reducerFns = _(getMethods(reducerCtor))
        .map((method: keyof Reducer) => {
            type Args = Parameters<GetCtorReducer<Ctor>[typeof method]>;

            const actionBuilder = (...args: Args): Action<MainState> => ({
                update: mainState => {
                    return stateUpdater(mainState, state => {
                        const reducer = new reducerCtor(state);
                        const methodFn = reducer[method].bind(reducer);
                        return methodFn(...args);
                    });
                },
            });
            return [method, actionBuilder];
        })
        .fromPairs()
        .value();

    // reducer1.reducer2.method(arg1, arg2).update(state1);
    const nestedNamespace = _((reducerCtor.nested || {}) as NestedReducers<MainState>)
        .mapValues((ReducerClass: Nested[NestedKey], key: NestedKey) => {
            const stateUpdaterForKey: UpdateUpdater<MainState, State> = (mainState, mapper) => {
                return stateUpdater(mainState, state => {
                    return { ...state, [key]: mapper(state[key]) };
                });
            };

            return getActionsWithMapper(ReducerClass, stateUpdaterForKey);
        })
        .value();

    return { ...reducerFns, ...nestedNamespace } as unknown as Expand<
        GetActions<MainState, GetCtorReducer<Ctor>, Ctor["nested"]>
    >;
}

export { BaseReducer as Reducer, getActions };
