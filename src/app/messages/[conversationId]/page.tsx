"use client"
import MessageBox from "@components/messages/MessageBox"
import Conversations from "@components/messages/Conversations"
import ParticipantInfo from "@components/messages/ParticipantInfo"
import useMediaQuery from "@hooks/useMediaQuery"

interface Props {
    params: { conversationId: string }
}

export default function ConversationPage( { params }: Props ){
    const isDesktopOrLaptop = useMediaQuery( '(min-width: 1024px)' )

    return (
        <div className="h-screen grid grid-cols-12 md:px-10 sm:px-4 pt-16 -mt-16 bg-theme-gray">
            { isDesktopOrLaptop ? (
                <div className="col-span-12 lg:col-span-3 p-5 h-full lg:border-r-2 border-gray-20 none">
                    <Conversations/>
                </div>
            ) : null }

            <div className="col-span-12 lg:col-span-6 p-5 relative overflow-hidden flex flex-col">
                <MessageBox conversationId={ params.conversationId }/>
            </div>

            { isDesktopOrLaptop ? (
                <div className="col-span-3 p-5 border-l-2 border-gray-200">
                    <ParticipantInfo conversationId={ params.conversationId }/>
                </div>
            ) : null }
        </div>
    )
}