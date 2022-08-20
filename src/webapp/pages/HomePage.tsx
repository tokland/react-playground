import React from "react";
import Link from "../components/Link";
import { Session } from "../Session";

const HomePage: React.FC = () => {
    return (
        <>
            <Session />
            <Link to={{ type: "counter", id: 1 }} text="Counter 1" />
        </>
    );
};

export default HomePage;
