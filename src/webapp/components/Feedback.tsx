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
            {success && <div style={styles.success}>{success.message}</div>}
            {error && <div style={styles.error}>{error.message}</div>}
        </>
    );
};

const styles = {
    success: { color: "green" },
    error: { color: "red" },
};

export default React.memo(Feedback);
