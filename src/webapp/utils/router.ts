import { Expand } from "../../libs/ts-utils";
import { Effect } from "../hooks/useCancellableEffect";

export function route<Path extends string, Params extends readonly string[] = []>(
    path: Path,
    options: Omit<TypedRoute<Path, Params>, "path" | "pathRegExp">
): TypedRoute<Path, Params> {
    // Converts "/some/path/[id]/[value]" to Regexp /some/path/(?<id>[\w-_]+)/(?<value>[\w-_]+)
    const pathRegExp = new RegExp(path.replace(/\[(\w+)\]/, "(?<$1>[\\w-_]+)"));
    return { path, pathRegExp, ...options };
}

export type GenericRoutes = Record<string, GenericRoute>;

export function getPathFromRoute<Routes extends GenericRoutes>(
    routes: Routes,
    selector: RouteSelector<Routes>
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

export function runRouteOnEnterForPath(routes: GenericRoutes, location: Location) {
    for (const route of Object.values(routes)) {
        const match = location.pathname.match(route.pathRegExp);

        if (match) {
            const args = match.groups as Parameters<typeof route.onEnter>[0]["args"];
            const params = Object.fromEntries(new URLSearchParams(window.location.search));
            return route.onEnter({ args, params });
        }
    }
}

interface TypedRoute<Path extends string, Params extends readonly string[]> {
    path: Path;
    pathRegExp: RegExp;
    onEnter: (options: {
        args: ArgsFromPath<Path>;
        params: Partial<Record<Params[number], string>>;
    }) => void | Effect<void>;
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

/* Selectors */

export type RouteSelector<Routes extends GenericRoutes> = {
    [K in keyof Routes]: Expand<
        { key: K } & GetArgs<ArgsFromPath<Routes[K]["path"]>> &
            GetParams<Exclude<Routes[K]["params"], undefined>>
    >;
}[keyof Routes];

type GetArgs<T> = {} extends T ? { args?: never } : { args: T };

type GetParams<T extends readonly string[]> = T["length"] extends 0
    ? { params?: never }
    : { params?: Partial<Record<T[number], string>> };

/*
type T1 = RouteSelector<typeof routes>;

const routes = {
    home: route("/home", {
        onEnter: () => 1,
    }),

    counterForm: route("/counter/[id]", {
        onEnter: ({ args }) => 1,
    }),
};
*/
