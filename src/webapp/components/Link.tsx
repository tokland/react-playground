import React from "react";
import { getPathFromRoute, RouteSelector } from "../utils/router";
import { goTo, routes } from "./Router";

interface LinkProps {
    to: RouteSelector<typeof routes>;
    children: React.ReactNode;
}

const Link: React.FC<LinkProps> = props => {
    const { to, children } = props;
    const href = React.useMemo(() => getPathFromRoute(routes, to), [to]);

    const goToHref = React.useCallback<React.MouseEventHandler<HTMLAnchorElement>>(
        ev => {
            ev.preventDefault();
            goTo(to);
        },
        [to]
    );

    return (
        <a href={href} onClick={goToHref}>
            {children}
        </a>
    );
};

export default React.memo(Link);
