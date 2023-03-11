"use client"
import React from 'react'
import Link from "next/link"
import { Navbar as BaseNavbar } from "@material-tailwind/react"
import { AiOutlineHome as HomeIcon } from "react-icons/ai"
import IconButton from "@components/global/IconButton"
import ExpandableSearch from "@components/global/ExpandableSearch"
import NotificationsNavLink from "@components/navbar/NotificationsNavLink"
import MessagesNavLink from "@components/navbar/MessagesNavLink"
import UserMenu from "@components/navbar/UserMenu"
import useAuthState from "@hooks/useAuthState"

export default function Navbar(){
    const { isAuthenticated } = useAuthState()

    if( ! isAuthenticated ) return null

    return (
        <BaseNavbar id="appNavbar" fullWidth className="relative z-10 mx-auto px-4 lg:px-8 py-2 lg:py-4 z-20">
            <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
                <div className="mr-1">
                    <Link href="/">
                        <IconButton className="p-5">
                            <HomeIcon size={ 27 }/>
                        </IconButton>
                    </Link>
                </div>

                <div className="flex">
                    <div className="mr-2 flex">
                        <ExpandableSearch/>
                        <NotificationsNavLink/>
                        <MessagesNavLink/>
                    </div>
                    <UserMenu/>
                </div>
            </div>
        </BaseNavbar>
    )
}