import React from "react";
import { actions, dispatch, useAppState } from "./app/App";
import { Field, useForm } from "typed-react-form";

const Session: React.FC = () => {
    const session = useAppState(state => state.session);
    const form = useForm({ username: "" });

    const login = React.useMemo(() => {
        return form.handleSubmit(form_ => {
            dispatch(actions.session.login(form_.values.username));
        });
    }, [form]);

    return (
        <div>
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
