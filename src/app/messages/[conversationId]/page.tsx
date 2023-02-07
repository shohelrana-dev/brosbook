"use client"
import MessageBox from "@components/messages/MessageBox"

interface Props {
    params: { conversationId: string }
}

export default function Page( { params }: Props ){
    return <MessageBox conversationId={ params.conversationId }/>
}