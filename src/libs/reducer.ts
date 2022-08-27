export function buildSimpleReducer<State>() {
    return function <Actions extends Record<string, (...args: any[]) => (state: State) => State>>(
        actions: Actions
    ) {
        return actions;
    };
}
