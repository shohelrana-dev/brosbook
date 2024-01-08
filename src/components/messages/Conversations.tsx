'use client'
import SearchConversation from '@/components/messages/Conversations/SearchConversation'
import ConversationList from '@/components/messages/Conversations/ConversationList'

export default function Conversations() {
    return (
        <div className='h-screen-content flex flex-col px-3'>
            <div>
                <h2 className='text-2xl font-medium mb-2 mt-6'>Chats</h2>

                <SearchConversation />

                <h3 className='text-lg font-medium mb-3'>Recent chats</h3>
            </div>

            <div className='flex-grow overflow-y-auto' style={{flex: 1}}>
                <ConversationList />
            </div>
        </div>
    )
}
