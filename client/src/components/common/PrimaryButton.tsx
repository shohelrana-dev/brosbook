import React, { ButtonHTMLAttributes } from 'react'
import { CircularProgress } from "@mui/material"

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string
    isLoading?: boolean
    fullWidth?: boolean
}

function PrimaryButton(props: PrimaryButtonProps) {
    const { type, title, isLoading = false, className = '', fullWidth = false, ...rest } = props

    return (
        <button
            type={type ? type : 'button'}
            disabled={isLoading}
            className={`button button-blue rounded py-0 h-10 mt-3 ${className}${fullWidth ? ' w-full' : ''}`}
            {...rest}
        >
            {isLoading ? <CircularProgress className="!text-white" size="20px" /> : title}
        </button>
    );
};

export default PrimaryButton;
