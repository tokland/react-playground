import React from "react";
import { appContext } from "./App";
import { AppStateReducer, AppState } from "./AppState";
import { Selector, SetState, StateContext, useContextState } from "./StateContext";

const appActions = buildActions<AppState>()(setState => ({
    increment: () => setState(state => new AppStateReducer(state).add(+1)),
    decrement: () => setState(state => new AppStateReducer(state).add(-1)),
}));

export function useAppContext<SelectedState>(selector: Selector<AppState, SelectedState>) {
    return useAppContextWithActions(appContext, selector, appActions);
}

/* Generic */

function buildActions<State>() {
    return function <Actions>(getActions: (setState: SetState<State>) => Actions) {
        return getActions;
    };
}

export function useAppContextWithActions<State, SelectedState, Actions>(
    stateContext: StateContext<State>,
    selector: Selector<State, SelectedState>,
    getActions: (setState: SetState<State>) => Actions
) {
    const [value, setState] = useContextState(stateContext, selector);

    const actions = React.useMemo(() => {
        return getActions(setState);
    }, [getActions, setState]);

    return [value, actions] as const;
}
