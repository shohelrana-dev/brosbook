import React from 'react'
import { Conversation } from "@interfaces/conversation.interfaces"
import ConversationItem from "@components/messages/Conversations/ConversationItem"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetConversationsQuery } from "@services/conversationApi"
import InfiniteScroll from 'react-infinite-scroller'
import ConversationsSkeleton from "@components/skeletons/ConversationsSkeleton"
import Error from "@components/global/Error"
import tw from "twin.macro"

const Wrapper              = tw.div`h-full`
const Heading              = tw.h2`text-lg font-medium mb-3`
const StyledInfiniteScroll = tw( InfiniteScroll )`h-full overflow-y-auto scrollbar-hide`

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
            <StyledInfiniteScroll
                loadMore={ loadMore }
                hasMore={ hasMore }
                loader={ <ConversationsSkeleton/> }
            >
                { conversations && conversations.map( ( conversation: Conversation ) => (
                    <ConversationItem conversation={ conversation } key={ conversation.id }/>
                ) ) }
            </StyledInfiniteScroll>
        )
    }

    return (
        <Wrapper>
            <Heading>Recent chats</Heading>

            { content }
        </Wrapper>
    )
}