import React from 'react'
import Loading from "@components/global/Loading"
import { Conversation } from "@interfaces/conversation.interfaces"
import ConversationItem from "@components/messages/Conversations/ConversationItem"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetConversationsQuery } from "@services/conversationApi"
import InfiniteScroll from 'react-infinite-scroller'
import ConversationsLoader from "@components/loaders/ConversationsLoader"

export default function ConversationList(){
    const {
              items: conversations,
              isLoading,
              hasMoreItem,
              loadMoreItem
          } = useGetInfiniteListQuery<Conversation>( useGetConversationsQuery )

    return (
        <div className="h-full">
            <h2 className="text-lg font-medium mb-3">Recent chats</h2>
            { isLoading ? <ConversationsLoader/> : null }

            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <Loading size={ 50 }/> }
                className="h-full overflow-y-auto scrollbar-hide"
            >
                { conversations && conversations.map( ( conversation: Conversation ) => (
                    <ConversationItem conversation={ conversation } key={ conversation.id }/>
                ) ) }
            </InfiniteScroll>

            { ( ! isLoading && conversations?.length < 1 ) ? (
                <p className="text-gray-700">You have no conversation</p>
            ) : null }
        </div>
    )
}