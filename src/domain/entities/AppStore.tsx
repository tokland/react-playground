import { AppState, Page } from "./AppState";
import { getStoreHooks } from "../../webapp/StoreHooks";
import { buildSimpleReducer } from "../../libs/reducer";

export const appReducer = buildSimpleReducer<AppState>()({
    goTo: (page: Page) => state => ({ ...state, page }),
    //counter: counterReducer,
});

const initialAppState: AppState = {
    page: { type: "home" },
    session: { type: "notLogged" },
};

const hooks = getStoreHooks(initialAppState);

export const { useState: useAppState, useDispatch: userAppDispatch } = hooks;
