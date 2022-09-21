export function route<Path extends string, Params extends readonly string[] = []>(
    path: Path,
    options: Omit<TypedRoute<Path, Params>, "path" | "pathRegExp">
): TypedRoute<Path, Params> {
    // Converts "/some/path/[id]/[value]" to Regexp /some/path/(?<id>[\w-_]+)/(?<value>[\w-_]+)
    const pathRegExp = new RegExp(path.replace(/\[(\w+)\]/, "(?<$1>[\\w-_]+)"));
    return { path, pathRegExp, ...options };
}

export type Routes = Record<string, GenericRoute>;

export type MkSelector<R extends Routes> = {
    [K in keyof R]: { key: K } & GetArgs<ArgsFromPath<R[K]["path"]>> &
        GetParams<Exclude<R[K]["params"], undefined>>;
}[keyof R];

export function getPathFromRoute<R extends Routes, Selector extends MkSelector<R>>(
    routes: R,
    selector: Selector
): string {
    const route = routes[selector.key];
    if (!route) throw new Error("No route");

    const pathname = route.path.replace(/\[(\w+)\]/g, (_match, name: string) => {
        const args: Record<string, string> = selector.args || {};
        return args[name] || "";
    });

    const params = (selector.params || {}) as Record<string, string>;
    const search = new URLSearchParams(params).toString();

    return pathname + (search ? "?" : "") + search;
}

export async function runRouteOnEnterForPath<Actions>(
    routes: Routes,
    actions: Actions,
    location: Location
) {
    Object.values(routes).forEach(route => {
        const match = location.pathname.match(route.pathRegExp);

        if (match) {
            const args = match.groups as Parameters<typeof route.onEnter>[0]["args"];
            const params = Object.fromEntries(new URLSearchParams(window.location.search));
            route.onEnter({ args, params });
        }
    });
}

interface TypedRoute<Path extends string, Params extends readonly string[]> {
    path: Path;
    pathRegExp: RegExp;
    onEnter: (options: {
        args: ArgsFromPath<Path>;
        params: Partial<Record<Params[number], string>>;
    }) => void;
    params?: Params;
}

type GenericRoute = TypedRoute<string, readonly string[]>;

type ArgsFromPath<Path extends string> = ExtractArgsFromPathRec<Path, {}>;

type ExtractArgsFromPathRec<
    Path extends string,
    AccArgs = {}
> = Path extends `${string}[${infer Var}]${infer StringTail}`
    ? ExtractArgsFromPathRec<StringTail, AccArgs & Record<Var, string>>
    : { [K in keyof AccArgs]: AccArgs[K] };

type GetArgs<T> = {} extends T ? { args?: T } : { args: T };

type GetParams<T extends readonly string[]> = T["length"] extends 0
    ? { params?: never }
    : { params?: Partial<Record<T[number], string>> };
