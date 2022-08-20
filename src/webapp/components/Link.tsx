import React from "react";
import { AppState } from "../../domain/entities/AppState";
import { useAppStore } from "../../domain/entities/AppStore";
import { getPath } from "../App";

export interface LinkProps {
    to: AppState["page"];
    text: string;
}

const Link: React.FC<LinkProps> = props => {
    // TODO: useAppState / useAppActions
    const [_currentPage, actions] = useAppStore(state => state.page);
    const page = props.to;
    const path = React.useMemo(() => getPath(page), [page]);

    const goTo = React.useCallback<NonNullable<React.MouseEventHandler>>(
        ev => {
            ev.preventDefault();
            window.history.pushState(page, "Title", path);
            actions.goTo(page);
        },
        [actions, page, path]
    );

    return (
        <a onClick={goTo} href={path}>
            {props.text}
        </a>
    );
};

export default Link;
