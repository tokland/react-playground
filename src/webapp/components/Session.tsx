import React from "react";
import { actions, dispatch, useAppState } from "./app/App";
import { Field, useForm } from "typed-react-form";
import { useActions, useStoreState } from "../AppActions";

const Session: React.FC = () => {
    const session = useAppState(state => state.session);
    const form = useForm({ username: "" });

    const login = React.useMemo(() => {
        return form.handleSubmit(formState => {
            dispatch(actions.session.login(formState.values.username));
        });
    }, [form]);
    const actions2 = useActions();
    const value = useStoreState(state => state.x);

    return (
        <div>
            <button onClick={() => actions2.add(1)}>Add</button>
            value={value}
            {session.type === "loggedIn" ? (
                <>
                    <span>Logged in as {session.username}</span>&nbsp;
                    <button onClick={() => dispatch(actions.session.logout())}>Logout</button>
                </>
            ) : (
                <form onSubmit={login}>
                    <Field form={form} name="username" />
                    <button type="submit">Login</button>
                </form>
            )}
        </div>
    );
};

export default React.memo(Session);
