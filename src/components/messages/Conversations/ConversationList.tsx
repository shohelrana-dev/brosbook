import React from 'react'
import Loading from "@components/common/Loading"
import { Conversation } from "@interfaces/conversation.interfaces"
import ConversationItem from "@components/messages/Conversations/ConversationItem"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetConversationsQuery } from "@services/conversationApi"
import { useSelector } from "react-redux"
import { selectChatState } from "@slices/chatSlice"

export default function ConversationList(  ){
    const { isLoading }                       = useGetInfiniteListQuery<Conversation>( useGetConversationsQuery, {} )
    const { conversations }                   = useSelector( selectChatState )
    return (
        <div>
            <h2 className="text-lg font-medium mb-3">Recent chats</h2>
            { isLoading ? <Loading size={ 35 }/> : null }

            { conversations && conversations.map( ( conversation: Conversation ) => (
                <ConversationItem conversation={ conversation } key={ conversation.id }/>
            ) ) }

            { ! isLoading && conversations.length < 1 && (
                <p className="text-gray-700">You have no conversation</p>
            ) }
        </div>
    )
}