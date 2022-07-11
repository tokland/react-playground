import React from "react";
import _ from "lodash";
import { AppState, initialAppState, CounterState } from "./AppState";
import { getStore, Selector, SetState } from "./StoreState";

function buildReducer<State>() {
    return function <Actions extends ActionsBase<State>, Nested extends NestedBase<State>>(
        actions: Actions,
        nested: Nested
    ) {
        return { actions, nested };
    };
}

const counterReducer = buildReducer<CounterState>()(
    {
        add: (n: number) => state => ({ value: state.value + n }),
        increment: () => state => ({ value: state.value + 1 }),
        decrement: () => state => ({ value: state.value - 1 }),
    },
    {}
);

const appReducer = buildReducer<AppState>()(
    {
        reset: () => _state => initialAppState,
    },
    {
        counter: counterReducer,
    }
);

type T1 = Replace<typeof appReducer>;
type T2 = T1["reset"];
type T3 = T1["counter"]["add"];

type GetReducerState<Reducer extends BuildReducer<any>> = Reducer extends BuildReducer<infer State>
    ? State
    : never;

type ActionsBase<State> = Record<string, (...args: any[]) => (state: State) => State>;

type NestedBase<State> = { [K in keyof State]?: BuildReducer<State[K]> };

interface BuildReducer<State> {
    actions: ActionsBase<State>;
    nested: NestedBase<State>;
}

type ActionsToEffects<Actions> = {
    [A in keyof Actions]: Actions[A] extends (...args: infer Args) => (state: any) => any
        ? (...args: Args) => void
        : never;
};

type ReplaceNested<Nested, State> = Nested extends BuildReducer<State> ? Replace<Nested> : never;

type Replace<
    Reducer extends BuildReducer<any>,
    State = GetReducerState<Reducer>,
    Actions = Reducer["actions"],
    Nested = Reducer["nested"]
> = ActionsToEffects<Actions> & {
    [N in keyof Nested & keyof State]: ReplaceNested<Nested[N], State[N]>;
};

function getSetStateActions<
    State,
    Actions extends ActionsBase<State>,
    Nested extends NestedBase<State>
>(
    reducer: { actions: Actions; nested: Nested },
    setState: SetState<State>
): Replace<typeof reducer> {
    const actions2 = _.mapValues(reducer.actions, (value2: Actions[keyof Actions]) => {
        return (...args: any[]) => {
            setState(state => {
                return value2(...args)(state);
            });
        };
    });

    const nested2 = _.mapValues(reducer.nested, (reducerB: any, key: keyof State) => {
        const actions2b = _.mapValues(reducerB.actions, (value2: any) => {
            return (...args: any[]) => {
                setState(state => {
                    const stateB = state[key];
                    const newStateB: State[typeof key] = value2(...args)(stateB);
                    return { ...state, [key]: newStateB };
                });
            };
        });

        // TOOD: Add reducer with recursion + generic updater

        return actions2b;
    });

    return { ...actions2, ...nested2 } as any;
}

export function useAppStore<SelectedState>(selector: Selector<AppState, SelectedState>) {
    const [selectedState, setState] = useAppStoreWithSetState(selector);

    const actions = React.useMemo(() => {
        return getSetStateActions(appReducer, setState); // Add other objects useful for the actions reducer
    }, [setState]);

    return [selectedState, actions] as const;
}

/*
addRandom: () =>
    getRandomInteger({ min: 1, max: 5 })
        .then(value => update(state => new AppStateReducer(state).addCounter(value)))
        .catch(console.error),
*/

async function getRandomInteger(options: { min: number; max: number }): Promise<number> {
    const { min, max } = options;
    const value = Math.floor(Math.random() * (max - min) + min);

    return new Promise(resolve => {
        window.setTimeout(() => resolve(value), 1e3);
    });
}

const useAppStoreWithSetState = getStore(initialAppState);
