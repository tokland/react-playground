import { AppState, initialAppState, CounterState } from "./AppState";
import { buildReducer, getActionsStore } from "./StoreActions";

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

export const useAppStoreWithActions = getActionsStore(initialAppState, appReducer);

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
