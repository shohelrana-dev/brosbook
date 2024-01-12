'use client'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import MessageBox from '~/components/messages/MessageBox'
import { useGetConversationByIdQuery } from '~/services/conversationsApi'

export default async function ChatPage() {
	const params = useParams<{ conversationId?: string }>()
	const { data: conversation } = useGetConversationByIdQuery(params?.conversationId!)

	useEffect(() => {
		document.title = conversation?.participant.fullName! || ''
	}, [conversation])

	return <MessageBox />
}
