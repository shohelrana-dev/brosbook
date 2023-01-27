"use client"
import MessageBox from "@components/messages/MessageBox"
import Conversations from "@components/messages/Conversations"
import ParticipantInfo from "@components/messages/ParticipantInfo"
import useMediaQuery from "@hooks/useMediaQuery"
import { useEffect, useState } from "react"

interface Props {
    params: { conversationId: string }
}

export default function ConversationPage( { params }: Props ){
    const [headerHeight, setHeaderHeight] = useState<number>()
    const isDesktopOrLaptop               = useMediaQuery( '(min-width: 1024px)' )

    useEffect( () => {
        setHeaderHeight( document.querySelector( '#appHeader' )?.clientHeight )
    }, [] )

    return (
        <div className="h-screen flex overflow-hidden"
             style={ { marginTop: `-${ headerHeight }px`, paddingTop: headerHeight } }>
            { isDesktopOrLaptop ? (
                <div className="hidden lg:block w-1/4 p-5 lg:border-r-2 border-gray-20 h-full">
                    <Conversations/>
                </div>
            ) : null }

            <div className="w-full lg:w-1/2 p-5 lg:border-r-2 border-gray-20 h-full">
                <MessageBox conversationId={ params.conversationId }/>
            </div>

            { isDesktopOrLaptop ? (
                <div className="hidden lg:block w-1/4 p-5 h-full">
                    <ParticipantInfo conversationId={ params.conversationId }/>
                </div>
            ) : null }
        </div>
    )
}