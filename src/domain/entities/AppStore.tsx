import { AppState, Page } from "./AppState";
import { getStoreHooks } from "../../webapp/StoreActions";
import { buildReducer } from "../../libs/reducer";

const appReducer = buildReducer<AppState>()({
    goTo: (page: Page) => state => ({ ...state, page }),
    //counter: counterReducer,
});

export const initialAppState: AppState = {
    page: { type: "home" },
    session: { type: "notLogged" },
};

export const {
    useState: useAppState,
    useActions: useAppActions,
    useSetState: useAppSetState,
} = getStoreHooks(initialAppState, appReducer);
