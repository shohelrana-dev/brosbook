import Conversations from '@components/messages/Conversations'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Messages',
}

export default function ConversationsPage() {
    return <Conversations />
}
