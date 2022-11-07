"use client"
import React from 'react'
import TabLink from "@components/common/TabLink"
import {usePathname} from "next/navigation"

interface TabLinkListProps {
    links: {title: string, link: string}[]
}

function TabLinkList({links}: TabLinkListProps) {
    const pathname = usePathname()
    return (
        <div className="px-6 mt-5 border-b-2 border-gray-100">
            {links.map(link => (
                <TabLink active={link.link === pathname} title={link.title} href={link.link} key={link.link}/>
            ))}
        </div>
    )
}

export default TabLinkList