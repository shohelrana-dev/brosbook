"use client"
import MessageBox from "@components/messages/MessageBox"
import Conversations from "@components/messages/Conversations"
import ParticipantInfo from "@components/messages/ParticipantInfo"
import useMediaQuery from "@hooks/useMediaQuery"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useGetConversationByIdQuery } from "@services/conversationsApi"

export default async function ChatPage() {
    const params = useParams<{ conversationId?: string }>()
    const isDesktopOrLaptop = useMediaQuery('(min-width: 1024px)')
    const { data: conversation } = useGetConversationByIdQuery(params?.conversationId!)

    useEffect(() => {
        document.title = conversation?.participant.fullName!
    }, [conversation])

    return (
        <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr]">
            {isDesktopOrLaptop ? (
                <div className="hidden lg:block pr-4 border-solid border-0 border-r-2 border-gray-200">
                    <Conversations />
                </div>
            ) : null}

            <div className="lg:px-4">
                <MessageBox />
            </div>

            {isDesktopOrLaptop ? (
                <div className="hidden lg:block pl-4 border-solid border-0 border-l-2 border-gray-200">
                    <ParticipantInfo />
                </div>
            ) : null}
        </div>
    )
}