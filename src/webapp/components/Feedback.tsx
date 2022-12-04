import React from "react";
import { useAppState } from "../Store";

const Feedback: React.FC = () => {
    const feedback = useAppState(state => state.feedback);
    const [visible, setVisible] = React.useState(feedback);

    React.useEffect(() => {
        setVisible(feedback);

        const timeoutId = setTimeout(() => {
            setVisible({});
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [feedback]);

    const { success, error } = visible;

    return (
        <>
            {success && <div style={{ color: "green" }}>{success.message}</div>}
            {error && <div style={{ color: "red" }}>{error.message}</div>}
        </>
    );
};

export default React.memo(Feedback);
