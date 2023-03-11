import React from 'react'
import { Conversation } from "@interfaces/conversation.interfaces"
import ConversationItem from "@components/messages/Conversations/ConversationItem"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetConversationsQuery } from "@services/conversationApi"
import InfiniteScroll from 'react-infinite-scroller'
import ConversationsSkeleton from "@components/skeletons/ConversationsSkeleton"
import Error from "@components/global/Error"

export default function ConversationList(){
    const {
              isLoading,
              isSuccess,
              isError,
              items: conversations,
              error,
              hasMore,
              loadMore
          } = useGetInfiniteListQuery<Conversation>(
        useGetConversationsQuery
    )

    //decide content
    let content = null
    if( isLoading ){
        content = <ConversationsSkeleton/>
    } else if( isSuccess && conversations.length === 0 ){
        content = <p className="text-gray-700">You have no conversation</p>
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && conversations.length > 0 ){
        content = (
            <InfiniteScroll
                loadMore={ loadMore }
                hasMore={ hasMore }
                loader={ <ConversationsSkeleton/> }
                className="h-full overflow-y-auto scrollbar-hide"
            >
                { conversations && conversations.map( ( conversation: Conversation ) => (
                    <ConversationItem conversation={ conversation } key={ conversation.id }/>
                ) ) }
            </InfiniteScroll>
        )
    }

    return (
        <div className="h-full">
            <h2 className="text-lg font-medium mb-3">Recent chats</h2>

            { content }
        </div>
    )
}