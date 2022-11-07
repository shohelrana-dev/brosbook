import React, {ButtonHTMLAttributes, ReactNode} from 'react'
import Loading from "@components/common/Loading"

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title?: string
    isLoading?: boolean
    children?: ReactNode
}

function Button(props: PrimaryButtonProps) {
    let { title, isLoading = false, className, ...rest } = props

    className = `btn btn-primary btn-sm rounded-full text-white text-xs ${className}`

    return (
        <button disabled={isLoading} className={className} {...rest} >
            {isLoading ? <Loading size={25} color="#fff"/> : title ?? props.children}
        </button>
    )
}

export default Button
