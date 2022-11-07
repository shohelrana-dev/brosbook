import React, {ButtonHTMLAttributes, ReactNode} from 'react'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title?: string
    children?: ReactNode
}

function ButtonOutline(props: PrimaryButtonProps) {
    let { title, children, className = '', ...rest } = props

    className = `btn btn-primary btn-outline btn-sm rounded-full text-white text-xs hover:!text-gray-100 hover:!bg-gray-200 hover:!text-theme-blue ${className}`

    return (
        <button className={className} {...rest} >
            {title ? title : children}
        </button>
    )
}

export default ButtonOutline
