import React from "react";
import { Page } from "../../domain/entities/AppState";
import { appReducer, useAppSetState } from "../../domain/entities/AppReducer";

interface LinkProps {
    to: Page;
    text: string;
}

const Link: React.FC<LinkProps> = props => {
    const setState = useAppSetState();
    const page = props.to;
    const path = "/"; // React.useMemo(() => getPath(page), [page]);

    const goTo = React.useCallback<React.MouseEventHandler>(
        ev => {
            ev.preventDefault();
            setState(appReducer.setPage(page));
        },
        [setState, page]
    );

    return (
        <a onClick={goTo} href={path}>
            {props.text}
        </a>
    );
};

export default Link;
