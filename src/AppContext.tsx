import { appContext } from "./App";
import { AppState } from "./AppState";
import { useContextState } from "./StateContext";

type State = AppState;

export function useAppContext<SelectedState>(selector: (state: State) => SelectedState) {
    const [value, setState] = useContextState(appContext, selector);
    return [value, setState] as const;
}
