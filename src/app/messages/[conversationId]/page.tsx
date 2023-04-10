import MessageBox from "@components/messages/MessageBox"
import { getConversationById } from "@services/index"
import { cookies } from "next/headers"
import { Metadata } from "next"

export const generateMetadata = async( { params }: Props ): Promise<Metadata> => {
    const conversation = await getConversationById( params.conversationId, cookies() )

    return { title: conversation?.participant.fullName }
}

interface Props {
    params: { conversationId: string }
}

export default async function Page( { params }: Props ){
    return <MessageBox conversationId={ params.conversationId }/>
}