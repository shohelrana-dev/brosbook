"use client"
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { usePathname } from "next/navigation"
import Conversations from "@components/messages/Conversations"
import useMediaQuery from "@hooks/useMediaQuery"
import ParticipantInfo from "@components/messages/ParticipantInfo"
import classNames from "classnames"

export const revalidate = 0

function Layout( { children }: PropsWithChildren ){
    const pathname                        = usePathname()
    const [headerHeight, setHeaderHeight] = useState<number>()
    const isDesktopOrLaptop               = useMediaQuery( '(min-width: 1024px)' )

    useEffect( () => {
        setHeaderHeight( document.querySelector( '#appHeader' )?.clientHeight )
    }, [] )

    const conversationId = pathname?.replace( '/messages', '' )?.replace( '/', '' )

    return (
        <div className="h-screen flex overflow-hidden md:px-10 sm:px-4"
             style={ { marginTop: `-${ headerHeight }px`, paddingTop: headerHeight } }>

            { pathname === '/messages' || isDesktopOrLaptop ? (
                <div className="w-full lg:w-1/4 p-5 lg:border-r-2 border-gray-200 h-full">
                    <Conversations/>
                </div>
            ) : null }

            <div
                className={ classNames( 'w-full lg:w-1/2 p-5 h-full', { 'hidden': ! isDesktopOrLaptop && ! conversationId } ) }>
                { children }
            </div>

            { conversationId && isDesktopOrLaptop && ! pathname?.endsWith( '/info' ) ? (
                <div className="w-1/4 p-5 h-full border-l-2 border-gray-200">
                    <ParticipantInfo conversationId={ conversationId }/>
                </div>
            ) : null }
        </div>
    )
}

export default Layout