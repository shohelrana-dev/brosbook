import React, {useState} from 'react'
import { Conversation } from "@interfaces/conversation.interfaces"
import ConversationItem from "@components/messages/Conversations/ConversationItem"
import { useGetConversationsQuery } from "@services/conversationsApi"
import InfiniteScroll from 'react-infinite-scroll-component'
import ConversationsSkeleton from "@components/skeletons/ConversationsSkeleton"
import Error from "@components/global/Error"
import { ErrorResponse } from "@interfaces/index.interfaces"

export default function ConversationList(){
    const [page, setPage]    = useState( 1 )
    const conversationsQuery = useGetConversationsQuery( page )

    const { isLoading, isSuccess, isError, data: conversationsData } = conversationsQuery || {}
    const { items: conversations = [], nextPage }                    = conversationsData || {}
    const error                                                      = conversationsQuery.error as ErrorResponse || {}

    //decide content
    let content = null
    if( isLoading ){
        content = <ConversationsSkeleton/>
    } else if( isSuccess && conversations.length === 0 ){
        content = <p className="text-gray-700">You have no conversation</p>
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && conversations.length > 0 ){
        content =  (
            <InfiniteScroll
                next={() => setPage(nextPage!)}
                hasMore={!!nextPage}
                loader={<ConversationsSkeleton/>}
                dataLength={conversations.length}
                scrollableTarget="conversations-wrapper"

            >
            {
                conversations && conversations.map( ( conversation: Conversation ) => (
                    <ConversationItem conversation={ conversation } key={ conversation.id }/>
                ) )
            }
        </InfiniteScroll>
        )
    }

    return content
}