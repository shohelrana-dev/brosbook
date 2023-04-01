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
import tw from "twin.macro"
import { Container } from "@components/styles/Global.styles"

const StyledNavbar    = tw( BaseNavbar )`relative z-10 mx-auto px-4 lg:px-8 py-2 lg:py-4 z-20`
const StyledContainer = tw( Container )`mx-auto flex items-center justify-between text-blue-gray-900`
const LeftArea        = tw.div`mr-1 [button]:p-5`
const RightArea       = tw.div`flex`

export default function Navbar(){
    const { isAuthenticated } = useAuthState()

    if( ! isAuthenticated ) return null

    return (
        <StyledNavbar id="appNavbar" fullWidth>
            <StyledContainer>
                <LeftArea>
                    <Link href="/">
                        <IconButton>
                            <HomeIcon size={ 27 }/>
                        </IconButton>
                    </Link>
                </LeftArea>

                <RightArea>
                    <ExpandableSearch/>
                    <NotificationsNavLink/>
                    <MessagesNavLink/>
                    <UserMenu/>
                </RightArea>
            </StyledContainer>
        </StyledNavbar>
    )
}