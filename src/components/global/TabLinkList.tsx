"use client"
import React from 'react'
import { usePathname } from "next/navigation"
import { Box, Tab } from "@mui/material"
import { TabContext, TabList } from '@mui/lab'
import Link from "next/link"

interface TabLinkListProps {
    links: { label: string, pathname: string }[]
}

export default function TabLinkList( { links }: TabLinkListProps ) {
    const currentPathname = usePathname()

    return (
        <Box sx={ { width: '100%', typography: 'body1' } }>
            <TabContext value={ currentPathname }>
                <Box sx={ { borderBottom: 1, borderColor: 'divider' } }>
                    <TabList aria-label="Tab links">
                        { links.map(( { label, pathname } ) => (
                            <Tab
                                label={
                                    <Link href={ pathname }>
                                        { label }
                                    </Link>
                                }
                                value={ pathname }
                                sx={ { textTransform: 'inherit' } }
                            />
                        )) }
                    </TabList>
                </Box>
            </TabContext>
        </Box>
    )
}