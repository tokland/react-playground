import React from "react";
import { Page } from "../../domain/entities/AppState";
import { appReducer, userAppDispatch } from "../../domain/entities/AppReducer";
import { getPath } from "../App";

interface LinkProps {
    to: Page;
    text: string;
}

const Link: React.FC<LinkProps> = props => {
    const dispatch = userAppDispatch();
    const page = props.to;
    const path = React.useMemo(() => getPath(page), [page]);

    const goTo = React.useCallback<NonNullable<React.MouseEventHandler>>(
        ev => {
            ev.preventDefault();
            dispatch(appReducer.goTo(page));
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
