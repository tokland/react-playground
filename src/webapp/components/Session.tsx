import React from "react";
import { useAppState } from "./app/App";
import { useAppContext } from "./app/AppContext";
import { Field, useForm } from "typed-react-form";

const SessionComponent: React.FC = () => {
    const { actions } = useAppContext();
    const session = useAppState(state => state.session);
    const form = useForm({ username: "" });

    const login = React.useMemo(() => {
        return form.handleSubmit(form_ => {
            actions.session.login(form_.values.username);
        });
    }, [actions, form]);

    return (
        <div>
            {session.type === "loggedIn" ? (
                <>
                    <span>Logged in as {session.username}</span>&nbsp;
                    <button onClick={actions.session.logout}>Logout</button>
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

export default React.memo(SessionComponent);
