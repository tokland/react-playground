import { AppState, CounterState } from "./AppState";
import { buildReducer, getActionsStore } from "./StoreActions";

const counterReducer = buildReducer<CounterState>()({
    add: (n: number) => state => ({ value: state.value + n }),
    increment: () => state => ({ value: state.value + 1 }),
    decrement: () => state => ({ value: state.value - 1 }),
});

type SectionsState = AppState["sections"];

const sectionsReducer = buildReducer<SectionsState>()({
    counter: counterReducer,
});

const appReducer = buildReducer<AppState>()({
    reset: () => _state => initialAppState,
    sections: sectionsReducer,
});

const initialAppState: AppState = {
    session: { type: "notLogged" },
    sections: { counter: { value: 0 } },
};

// initialState -> setStateFromUrl(window.location.url)
// addEventListener("hashchange", event => setStateFromUrl(event.newURL));

// React.useEffect(() => setUrlFromState(state), [state]);
// window.history.pushState({}, 'Title', '/mtm/about');

export const useAppStore = getActionsStore(initialAppState, appReducer);
