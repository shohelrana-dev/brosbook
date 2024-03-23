import { Metadata } from 'next'
import Conversations from '~/components/messages/Conversations'

export const metadata: Metadata = {
    title: 'Messages',
}

export const revalidate = 0

export default function ConversationsPage() {
    return <Conversations />
}
