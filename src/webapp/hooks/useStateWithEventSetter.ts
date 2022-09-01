import React from "react";

export function useStateWithEventSetter(initialValue: string) {
    const [value, setValue] = React.useState(initialValue);
    const setValueFromEvent = React.useCallback(
        (ev: React.FocusEvent<HTMLInputElement>) => setValue(ev.currentTarget.value),
        []
    );

    return [value, setValueFromEvent] as const;
}
