export function getRouteBuilder<State, Actions>() {
    return function route<Path extends string, Params extends readonly string[] = []>(
        path: Path,
        options: Omit<TypedRoute<State, Actions, Path, Params>, "path" | "pathRegExp">
    ): TypedRoute<State, Actions, Path, Params> {
        // Convert "/some/path/[id]/[value]" to Regexp /some/path/(?<id>[\w-_]+)/?<value>[\w-_]+
        const pathRegExp = new RegExp(path.replace(/\[(\w+)\]/, "(?<$1>[\\w-_]+)"));
        return { path, pathRegExp, ...options };
    };
}

interface TypedRoute<State, Actions, Path extends string, Params extends readonly string[]> {
    path: Path;
    pathRegExp: RegExp;
    onEnter: (options: {
        state: State;
        actions: Actions;
        args: ExtractArgsFromPath<Path>;
        params: Partial<Record<Params[number], string>>;
    }) => unknown;
    params?: Params;
}

export type ExtractArgsFromPath<
    Path extends String,
    Output = {}
> = Path extends `${string}[${infer Var}]${infer StringTail}`
    ? ExtractArgsFromPath<StringTail, Output & Record<Var, string>>
    : { [K in keyof Output]: Output[K] };

export type GenericRoute = TypedRoute<any, any, any, any>;

export type Routes = Record<string, GenericRoute>;

export type MkSelector<R extends Routes> = {
    [K in keyof R]: { key: K; args: ExtractArgsFromPath<R[K]["path"]> };
}[keyof R];

export function getPathFromRoute<R extends Routes, Selector extends MkSelector<R>>(
    routes: R,
    selector: Selector
): string {
    const route = routes[selector.key];
    route?.pathRegExp;
    selector.key;
    selector.args;
    return `/`;
}

export async function runRouteOnEnterForPath<State, Actions>(
    routes: Routes,
    state: State,
    actions: Actions,
    path: string
) {
    Object.values(routes).forEach(route => {
        const match = path.match(route.pathRegExp);

        if (match) {
            const args = match.groups as Parameters<typeof route.onEnter>[0]["args"];
            // TODO: params from query string
            route.onEnter({ state, actions, args, params: {} });
        }
    });
}

/*
export function getRouterPathFromState<State>(routes: Route[], state: State): string {
    for (const route of routes) {
        const match = route.fromState(state);

        switch (match) {
            case true:
                return route.path;
            case false:
                continue;
            default:
                return match;
        }
    }

    return "/";
}
*/
