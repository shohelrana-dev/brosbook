"use client"
import { PropsWithChildren, useEffect, useState } from 'react'
import { useParams, usePathname } from "next/navigation"
import Conversations from "@components/messages/Conversations"
import useMediaQuery from "@hooks/useMediaQuery"
import ParticipantInfo from "@components/messages/ParticipantInfo"
import classNames from "classnames"
import tw, { styled } from "twin.macro"

const Wrapper = styled.div(( { navbarHeight }: { navbarHeight: number } ) =>
    [ `height: calc(100vh - ${ navbarHeight }px);`, tw`flex flex-wrap overflow-hidden md:px-10 sm:px-4` ]
)

export const revalidate = 0

export default function Layout( { children }: PropsWithChildren ) {
    const pathname                          = usePathname()
    const isDesktopOrLaptop                 = useMediaQuery('(min-width: 1024px)')
    const [ navbarHeight, setNavbarHeight ] = useState(72)
    const { conversationId }                = useParams()

    useEffect(() => {
        if ( typeof window !== "undefined" ) {
            setNavbarHeight(Number(document.querySelector('#appNavbar')?.clientHeight) + 2)
        }
    }, [])

    return (
        <Wrapper navbarHeight={ navbarHeight! }>

            { pathname === '/messages' || isDesktopOrLaptop ? (
                <div
                    className="w-full h-full lg:w-1/4 p-2 md:p-5 lg:border-0 lg:border-solid lg:border-r-2 lg:border-gray-200">
                    <Conversations/>
                </div>
            ) : null }

            <div
                className={ classNames('w-full lg:w-1/2 p-2 md:p-5 h-full', { 'hidden': !isDesktopOrLaptop && !conversationId }) }>
                { children }
            </div>

            { conversationId && isDesktopOrLaptop ? (
                <div className="w-1/4 p-2 md:p-5 h-full lg:border-0 lg:border-solid lg:border-l-2 lg:border-gray-200">
                    <ParticipantInfo/>
                </div>
            ) : null }
        </Wrapper>
    )
}