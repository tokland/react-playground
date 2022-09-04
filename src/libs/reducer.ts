import _ from "lodash";

type BaseActions<State> = Record<string, (...args: any[]) => (state: State) => Partial<State>>;

export function reducer<State>() {
    return function <Actions extends BaseActions<State>>(
        actions: Actions
    ): {
        [A in keyof Actions]: (...args: Parameters<Actions[A]>) => (state: State) => State;
    } {
        return _.mapValues(actions, action => (...args) => {
            return function (state: State): State {
                const newPartialState = action(...args)(state);
                return { ...state, ...newPartialState };
            };
        });
    };
}
