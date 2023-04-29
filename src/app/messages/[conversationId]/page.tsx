import MessageBox from "@components/messages/MessageBox"
import { getConversationById } from "@services/index"
import { cookies } from "next/headers"
import { Metadata } from "next"

export const generateMetadata = async( { params }: { params: { conversationId: string }} ): Promise<Metadata> => {
    const conversation = await getConversationById( params.conversationId, cookies() )

    return { title: conversation?.participant.fullName }
}

export default async function Page(){
    return <MessageBox/>
}