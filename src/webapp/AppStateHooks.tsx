import { AppState } from "../domain/entities/AppState";
import { getStoreHooks } from "./StoreHooks";

const initialAppState: AppState = {
    page: { type: "home" },
    session: { type: "logged", username: "arnau" },
    counter: undefined,
    isLoading: false,
};
const [useAppState, useAppSetState] = getStoreHooks(initialAppState);
export { useAppState, useAppSetState };
