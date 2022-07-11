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

type ActionsBase<State> = Record<string, (...args: any[]) => (state: State) => State>;

type NestedBase<State> = { [K in keyof State]?: BuildReducer<State[K]> };

type BuildReducer<State> = { actions: ActionsBase<State>; nested: NestedBase<State> };

// type ReplaceReducerState<State, Reducer extends BuilderReducer<State>> = ... RECURSIVE

type ReplaceActionsState<State, Actions> = {
    [A in keyof Actions]: Actions[A] extends (...args: infer Args) => (state: State) => State
        ? (...args: Args) => void
        : never;
};

type Pair<T1, T2> = [T1, T2];

type GetActions<Reducer> = Reducer extends { actions: infer Actions } ? Actions : never;

function getSetStateActions<
    State,
    Actions extends ActionsBase<State>,
    Nested extends NestedBase<State>
>(
    reducer: { actions: Actions; nested: Nested },
    setState: SetState<State>
): ReplaceActionsState<State, Actions> & {
    [K in keyof Nested & keyof State]: ReplaceActionsState<State[K], GetActions<Nested[K]>>;
} {
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
