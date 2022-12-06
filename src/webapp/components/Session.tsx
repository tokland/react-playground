import React from "react";
import { Field, useForm } from "typed-react-form";
import { useAppActions, useAppState } from "../Store";

const Session: React.FC = () => {
    const actions = useAppActions();
    const session = useAppState(state => state.session);
    const form = useForm({ username: "" });

    const login = React.useMemo(() => {
        return form.handleSubmit(formState => {
            actions.session.login(formState.values.username);
        });
    }, [form, actions]);

    return (
        <div>
            {session.type === "loggedIn" ? (
                <>
                    <span>Logged in as {session.username}</span>&nbsp;
                    <button onClick={() => actions.session.logout()}>Logout</button>
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
