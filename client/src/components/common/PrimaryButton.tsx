import React                from 'react';
import { CircularProgress } from "@mui/material";

interface PrimaryButtonProps {
    type?: "button" | "submit" | "reset"
    buttonTitle: string
    isLoading: boolean
}

function PrimaryButton( props: PrimaryButtonProps ) {
    const { type, buttonTitle, isLoading } = props

    return (
        <button
            type={ type ? type : 'button' }
            disabled={ isLoading }
            className="button button-blue w-full rounded py-0 h-10"
        >
            { isLoading ? <CircularProgress className="text-white" size="20px"/> : buttonTitle }
        </button>
    );
};

export default PrimaryButton;
