import { AppState, CounterState } from "./AppState";
import { buildReducer, getActionsStore } from "./StoreActions";

const counterReducer = buildReducer<CounterState>()({
    add: (n: number) => state => ({ value: state.value + n }),
    increment: () => state => ({ value: state.value + 1 }),
    decrement: () => state => ({ value: state.value - 1 }),
});

const sectionsReducer = buildReducer<AppState["sections"]>()({}, { counter: counterReducer });

const appReducer = buildReducer<AppState>()(
    { reset: () => _state => initialAppState },
    { sections: sectionsReducer }
);

const initialAppState: AppState = {
    session: { type: "notLogged" },
    sections: { counter: { value: 0 } },
};

export const useAppStore = getActionsStore(initialAppState, appReducer);
