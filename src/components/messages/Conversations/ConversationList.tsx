import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Error from '~/components/global/Error'
import Transition from '~/components/global/Transition'
import ConversationItem from '~/components/messages/Conversations/ConversationItem'
import ConversationsSkeleton from '~/components/skeletons/ConversationsSkeleton'
import { Conversation } from '~/interfaces/conversation.interfaces'
import { useGetConversationsQuery } from '~/services/conversationsApi'
import { extractErrorMessage } from '~/utils/error'

export default function ConversationList() {
    const [page, setPage] = useState(1)
    const conversationsQuery = useGetConversationsQuery(page)

    const { isLoading, isError, isSuccess, data: conversationsData, error } = conversationsQuery
    const { items: conversations, nextPage } = conversationsData || {}

    //decide content
    let content = null
    if (isLoading) {
        content = <ConversationsSkeleton />
    } else if (isError) {
        content = <Error message={extractErrorMessage(error)} />
    } else if (isSuccess && conversations && conversations.length === 0) {
        content = <p className='text-gray-700'>You have no conversation</p>
    } else if (isSuccess && conversations && conversations.length > 0) {
        content = (
            <Transition>
                <InfiniteScroll
                    next={() => setPage(nextPage!)}
                    hasMore={!!nextPage}
                    loader={<ConversationsSkeleton />}
                    dataLength={conversations.length}
                    scrollableTarget='conversations-wrapper'
                >
                    {conversations.map((conversation: Conversation) => (
                        <ConversationItem conversation={conversation} key={conversation.id} />
                    ))}
                </InfiniteScroll>
            </Transition>
        )
    }

    return content
}
