import React from "react";
import { Page } from "../../domain/entities/AppState";
import { useAppActions } from "../../domain/entities/AppStore";
import { getPath } from "../App";

export interface LinkProps {
    to: Page;
    text: string;
}

const Link: React.FC<LinkProps> = props => {
    const actions = useAppActions();
    const page = props.to;
    const path = React.useMemo(() => getPath(page), [page]);

    const goTo = React.useCallback<NonNullable<React.MouseEventHandler>>(
        ev => {
            ev.preventDefault();
            window.history.pushState(page, "unused", path);
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
