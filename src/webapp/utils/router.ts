export function getRouteBuilder<State, Store>() {
    return function route<Path extends string, Params extends readonly string[] = []>(
        path: Path,
        options: Omit<Route<State, Store, Path, Params>, "path">
    ): Route<State, Store, Path, Params> {
        return { path, ...options };
    };
}

export interface Route<State, Store, Path extends string, Params extends readonly string[]> {
    path: Path;
    onEnter: (options: {
        store: Store;
        args: ExtractArgsFromPath<Path>;
        params: Partial<Record<Params[number], string>>;
    }) => void | Promise<void>;
    fromState: (state: State) => string | boolean;
    params?: Params;
}

type ExtractArgsFromPath<
    Path extends String,
    Output = {}
> = Path extends `${string}[${infer Var}]${infer S2}`
    ? ExtractArgsFromPath<S2, Output & Record<Var, string>>
    : { [K in keyof Output]: Output[K] };

export async function runRouteOnEnterForMatchingPath<Store>(
    routes: GenericRoute[],
    store: Store,
    path: string
) {
    routes.forEach(route => {
        // Convert "/some/path/[id]/[value]" to Regexp /some/path/(?<id>[\w-_]+)/?<value>[\w-_]+
        const re = route.path.replace(/\[(\w+)\]/, "(?<$1>[\\w-_]+)");
        const match = path.match(new RegExp(re));

        if (match) {
            const args = match.groups as Parameters<typeof route.onEnter>[0]["args"];
            route.onEnter({ store, args, params: {} });
        }
    });
}

export type GenericRoute = Route<any, any, any, any>;

export function getRouterPathFromState<State>(routes: GenericRoute[], state: State): string {
    for (const route of routes) {
        const res = route.fromState(state);

        switch (res) {
            case true:
                return route.path;
            case false:
                continue;
            default:
                return res;
        }
    }

    return "/";
}
