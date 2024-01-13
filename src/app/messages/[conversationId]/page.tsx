'use client'
import { useEffect } from 'react'
import MessageBox from '~/components/messages/MessageBox'
import { useGetConversationByIdQuery } from '~/services/conversationsApi'

interface Props {
	params: {
		conversationId?: string
	}
}

export default function ChatPage({ params }: Props) {
	const { data: conversation } = useGetConversationByIdQuery(params?.conversationId!)

	useEffect(() => {
		document.title = conversation?.participant.fullName! || ''
	}, [conversation])

	return <MessageBox />
}
