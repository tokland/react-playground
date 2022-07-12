import React from "react";
import _ from "lodash";
import { AppState, initialAppState, CounterState } from "./AppState";
import { getStore, Selector, SetState } from "./StoreState";

const counterReducer = buildReducer<CounterState>()(
    {
        add: (n: number) => state => ({ ...state, value: state.value + n }),
        increment: () => state => ({ ...state, value: state.value + 1 }),
        decrement: () => state => ({ ...state, value: state.value - 1 }),
    },
    {}
);

const sectionsReducer = buildReducer<AppState["sections"]>()(
    {},
    {
        counter: counterReducer,
    }
);

const appReducer = buildReducer<AppState>()(
    {
        reset: () => _state => initialAppState,
    },
    { sections: sectionsReducer }
);

/* Implementation */

function buildReducer<State>() {
    return function <Actions extends ActionsBase<State>, Nested extends NestedBase<State>>(
        actions: Actions,
        nested: Nested
    ) {
        return { actions, nested };
    };
}

type GetReducerState<R extends ReducerBase> = R extends BuildReducer<infer State> ? State : never;

type ActionsBase<State> = Record<string, (...args: any[]) => (state: State) => State>;

type NestedBase<State> = { [K in keyof State]?: BuildReducer<State[K]> };

type ReducerBase = BuildReducer<any>;

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

function getEffectActions<Reducer extends ReducerBase, StateA, StateB>(
    reducer: Reducer,
    setState: SetState<StateA>,
    lens: {
        get: (stateA: StateA) => StateB;
        set: (stateA: StateA, stateB: StateB) => StateA;
    }
): Replace<Reducer> {
    const innerActions = _.mapValues(reducer.actions, (value2: any) => {
        return (...args: any[]) => {
            setState(stateA => {
                const stateB = lens.get(stateA);
                const fn = value2(...args);
                const newStateB = fn(stateB);
                return lens.set(stateA, newStateB);
            });
        };
    });

    const nestedActions = _.mapValues(reducer.nested, (reducerB: any, key: any) => {
        return getEffectActions(reducerB, setState, {
            get: stateA => {
                const stateB = lens.get(stateA) as any;
                return stateB[key];
            },
            set: (stateA, newStateB) => {
                const stateB = lens.get(stateA) as any;
                const newStateN = { ...stateB, [key]: newStateB };
                return lens.set(stateA, newStateN);
            },
        });
    });

    return { ...innerActions, ...nestedActions } as any;
}

// Convert to generic useStoreWithActions

const useAppStoreWithSetState = getStore(initialAppState);

export function useAppStore<SelectedState>(selector: Selector<AppState, SelectedState>) {
    const [selectedState, setState] = useAppStoreWithSetState(selector);

    const actions = React.useMemo(() => {
        return getEffectActions(appReducer, setState, {
            get: state => state,
            set: (_stateA, stateB: AppState) => stateB,
        });
    }, [setState]);

    return [selectedState, actions] as const;
}

/*
addRandom: () =>
    getRandomInteger({ min: 1, max: 5 })
        .then(value => update(state => new AppStateReducer(state).addCounter(value)))
        .catch(console.error),
        
        async function getRandomInteger(options: { min: number; max: number }): Promise<number> {
            const { min, max } = options;
            const value = Math.floor(Math.random() * (max - min) + min);
            
            return new Promise(resolve => {
                window.setTimeout(() => resolve(value), 1e3);
            });
}
*/
