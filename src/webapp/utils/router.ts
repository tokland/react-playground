import { AppActions } from "../AppActions";

export function goTo(url: string) {
    window.history.pushState({}, "", url);
}

export function route<Path extends string, Params extends readonly string[] = []>(
    path: Path,
    options: Omit<TypedRoute<Path, Params>, "path" | "pathRegExp" | "build">
): TypedRoute<Path, Params> {
    // Converts "/some/path/[id]/[value]" to Regexp /some/path/(?<id>[\w-_]+)/(?<value>[\w-_]+)
    const pathRegExp = new RegExp(path.replace(/\[(\w+)\]/, "(?<$1>[\\w-_]+)"));

    function build(
        args: ArgsFromPath<Path>,
        params: Partial<Record<Params[number], string>>
    ): string {
        const pathname = path.replace(/\[(\w+)\]/g, (_match, name: string) => {
            return (args as Record<string, string | undefined>)[name] || "";
        });

        const search = new URLSearchParams(params as any).toString();
        return pathname + (search ? "?" : "") + search;
    }
    return { path, pathRegExp, build, ...options };
}

export type GenericRoutes = Record<string, GenericRoute>;

export function runRouteOnEnterForPath(
    routes: GenericRoutes,
    location: Location,
    actions: AppActions
) {
    for (const route of Object.values(routes)) {
        const match = location.pathname.match(route.pathRegExp);

        if (match) {
            const args = match.groups as Parameters<typeof route.onEnter>[0]["args"];
            const params = Object.fromEntries(new URLSearchParams(window.location.search));
            route.onEnter({ actions, args, params });
        }
    }

    return;
}

interface TypedRoute<Path extends string, Params extends readonly string[]> {
    path: Path;
    pathRegExp: RegExp;
    onEnter: (options: {
        actions: AppActions;
        args: ArgsFromPath<Path>;
        params: Partial<Record<Params[number], string>>;
    }) => void;
    params?: Params;
    build: (args: ArgsFromPath<Path>, params: Partial<Record<Params[number], string>>) => string;
}

type GenericRoute = TypedRoute<string, readonly string[]>;

type ArgsFromPath<Path extends string> = ExtractArgsFromPathRec<Path, {}>;

type ExtractArgsFromPathRec<
    Path extends string,
    AccArgs = {}
> = Path extends `${string}[${infer Var}]${infer StringTail}`
    ? ExtractArgsFromPathRec<StringTail, AccArgs & Record<Var, string>>
    : { [K in keyof AccArgs]: AccArgs[K] };

// Test

const routes = {
    home: route("/home", {
        onEnter: () => 1,
    }),

    counterForm: route("/counter/[id]", {
        onEnter: ({ args }) => args.id,
    }),
};

const _counterAbcUrl = routes.counterForm.build({ id: "abc" }, {});
