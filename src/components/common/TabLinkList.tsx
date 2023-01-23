"use client"
import React from 'react'
import {usePathname} from "next/navigation"
import Link from "next/link"
import classNames from "classnames"

interface TabLinkListProps{
    links: {label: string, pathname: string}[]
}

function TabLinkList(props: TabLinkListProps) {
    const pathname = usePathname()

    const className = 'inline-block py-2 px-3 sm:px-4 text-gray-600 rounded mr-4 border-0 border-b-4 border-transparent hover:text-theme-blue'

    return (
        <div className="mt-5">
            {props.links.map(link => (
                <Link
                    key={link.pathname}
                    href={link.pathname}
                    className={classNames(className, pathname === link.pathname ? 'border-theme-blue text-theme-blue' : '')}
                >
                    {link.label}
                </Link>
            ))}
            <hr/>
        </div>
    )
}

export default TabLinkList