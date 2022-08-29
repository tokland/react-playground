import React from "react";

interface LinkProps {
    onClick(): void;
    text: string;
}

const Link: React.FC<LinkProps> = props => {
    const { onClick, text } = props;

    return <button onClick={onClick}>{text}</button>;
};

export default Link;
