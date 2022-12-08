import React from "react";
import { goTo } from "../utils/router";

interface LinkProps {
    to: string;
    children: React.ReactNode;
}

const Link: React.FC<LinkProps> = props => {
    const { to, children } = props;

    const goToFromEvent = React.useCallback<React.MouseEventHandler<HTMLAnchorElement>>(
        ev => {
            ev.preventDefault();
            goTo(to);
        },
        [to]
    );

    return (
        <a href={to} onClick={goToFromEvent}>
            {children}
        </a>
    );
};

export default React.memo(Link);
