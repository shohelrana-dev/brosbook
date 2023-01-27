import React from 'react'
import Loading from "@components/common/Loading"
import { Conversation } from "@interfaces/conversation.interfaces"
import ConversationItem from "@components/messages/Conversations/ConversationItem"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetConversationsQuery } from "@services/conversationApi"
import InfiniteScroll from 'react-infinite-scroller'

export default function ConversationList(){
    const {
              items: conversations,
              isLoading,
              isFetching,
              hasMoreItem,
              loadMoreItem
          } = useGetInfiniteListQuery<Conversation>( useGetConversationsQuery, {} )

    return (
        <div className="h-full">
            <h2 className="text-lg font-medium mb-3">Recent chats</h2>
            { isLoading ? <Loading size={ 40 }/> : null }

            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <Loading size={ 40 }/> }
                className="h-full overflow-y-auto scrollbar-hide"
            >
                { conversations.length > 1 ? conversations.map( ( conversation: Conversation ) => (
                    <ConversationItem conversation={ conversation } key={ conversation.id }/>
                ) ) : null }
            </InfiniteScroll>

            { ( ! isLoading && ! isFetching && conversations.length < 1 ) ? (
                <p className="text-gray-700">You have no conversation</p>
            ) : null }
        </div>
    )
}