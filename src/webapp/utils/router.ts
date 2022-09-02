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
