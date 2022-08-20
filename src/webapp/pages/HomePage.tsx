import React from "react";
import Link from "../components/Link";
import { Session } from "../Session";

const HomePage: React.FC = () => {
    return (
        <>
            <Session />
            <Link to={{ type: "counter", id: 1 }} text="Counter 1" />
            <Link to={{ type: "counter", id: 2 }} text="Counter 2" />
        </>
    );
};

export default HomePage;
