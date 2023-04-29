"use client"
import React, {PropsWithChildren, useEffect, useMemo, useState} from 'react'
import { usePathname } from "next/navigation"
import Conversations from "@components/messages/Conversations"
import useMediaQuery from "@hooks/useMediaQuery"
import ParticipantInfo from "@components/messages/ParticipantInfo"
import classNames from "classnames"
import tw, { styled } from "twin.macro"

const Wrapper = styled.div( ( { navbarHeight }: { navbarHeight: number } ) =>
    [`height: calc(100vh - ${ navbarHeight }px);`, tw`flex overflow-hidden md:px-10 sm:px-4`]
)

export const revalidate = 0

export default function Layout( { children }: PropsWithChildren ){
    const pathname          = usePathname()
    const isDesktopOrLaptop = useMediaQuery( '(min-width: 1024px)' )
    const [navbarHeight,setNavbarHeight ] = useState(72)

    useEffect( () => {
        if(typeof window !== "undefined"){
            setNavbarHeight( Number( document.querySelector( '#appNavbar' )?.clientHeight ) + 2)
        }
    }, [] )

    const conversationId = pathname?.replace( '/messages', '' )?.replace( '/', '' )

    return (
        <Wrapper navbarHeight={ navbarHeight! }>

            { pathname === '/messages' || isDesktopOrLaptop ? (
                <div className="w-full lg:w-1/4 p-2 md:p-5 lg:border-r-2 border-gray-200 h-full">
                    <Conversations/>
                </div>
            ) : null }

            <div
                className={ classNames( 'w-full lg:w-1/2 p-2 md:p-5 h-full', { 'hidden': ! isDesktopOrLaptop && ! conversationId } ) }>
                { children }
            </div>

            { conversationId && isDesktopOrLaptop && ! pathname?.endsWith( '/info' ) ? (
                <div className="w-1/4 p-2 md:p-5 h-full border-l-2 border-gray-200">
                    <ParticipantInfo/>
                </div>
            ) : null }
        </Wrapper>
    )
}