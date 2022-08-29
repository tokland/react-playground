import React from "react";
import { Page } from "../../domain/entities/AppState";
import { appReducer, useAppDispatch } from "../../domain/entities/AppReducer";

interface LinkProps {
    to: Page;
    text: string;
}

const Link: React.FC<LinkProps> = props => {
    const dispatch = useAppDispatch();
    const page = props.to;
    const path = "/"; // React.useMemo(() => getPath(page), [page]);

    const goTo = React.useCallback<React.MouseEventHandler>(
        ev => {
            ev.preventDefault();
            dispatch(appReducer.setPage(page));
        },
        [dispatch, page]
    );

    return (
        <a onClick={goTo} href={path}>
            {props.text}
        </a>
    );
};

export default Link;
