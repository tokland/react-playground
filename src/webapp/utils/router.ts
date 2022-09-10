export function getRouteBuilder<State, Store>() {
    return function route<Path extends string, Params extends readonly string[] = []>(
        path: Path,
        options: Omit<TypedRoute<State, Store, Path, Params>, "path" | "pathRegExp">
    ): TypedRoute<State, Store, Path, Params> {
        // Convert "/some/path/[id]/[value]" to Regexp /some/path/(?<id>[\w-_]+)/?<value>[\w-_]+
        const pathRegExp = new RegExp(path.replace(/\[(\w+)\]/, "(?<$1>[\\w-_]+)"));
        return { path, pathRegExp, ...options };
    };
}

interface TypedRoute<State, Store, Path extends string, Params extends readonly string[]> {
    path: Path;
    pathRegExp: RegExp;
    onEnter: (options: {
        state: State;
        store: Store;
        args: ExtractArgsFromPath<Path>;
        params: Partial<Record<Params[number], string>>;
    }) => unknown;
    fromState: (state: State) => string | boolean;
    params?: Params;
}

export type Route = TypedRoute<any, any, any, any>;

type ExtractArgsFromPath<
    Path extends String,
    Output = {}
> = Path extends `${string}[${infer Var}]${infer S2}`
    ? ExtractArgsFromPath<S2, Output & Record<Var, string>>
    : { [K in keyof Output]: Output[K] };

export async function runRouteOnEnterForPath<State, Store>(
    routes: Route[],
    state: State,
    store: Store,
    path: string
) {
    routes.forEach(route => {
        const match = path.match(route.pathRegExp);

        if (match) {
            const args = match.groups as Parameters<typeof route.onEnter>[0]["args"];
            route.onEnter({ state, store, args, params: {} });
        }
    });
}

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
