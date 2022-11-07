import React from 'react'
import Link, {LinkProps} from "next/link"

interface TabLinkProps extends LinkProps{
    title: string
    className?: string
    active?: boolean
}

function TabLink(props: TabLinkProps) {
    let {title, className, active, ...rest} = props
    const defaultClassName = `inline-block py-2 px-4 text-gray-600 rounded mr-4 border-0 border-b-4 border-transparent hover:text-theme-blue`

    className = `${defaultClassName} ${className} ${active ? 'border-theme-blue text-theme-blue' : ''}`

    return (
        <Link className={className}  {...rest}>{title}</Link>
    )
}

export default TabLink