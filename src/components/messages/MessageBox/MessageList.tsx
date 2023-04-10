import React, { useEffect, useRef, useState } from 'react'
import MessageItem from "@components/messages/MessageBox/MessageItem"
import { useGetMessagesQuery, useSeenAllMessagesMutation } from "@services/messagesApi"
import Loading from "@components/global/Loading"
import { Conversation, Message } from "@interfaces/conversation.interfaces"
import useAuthState from "@hooks/useAuthState"
import useInfiniteScroll from "react-infinite-scroll-hook"
import ChatSkeleton from "@components/skeletons/ChatSkeleton"
import Error from "@components/global/Error"
import { ErrorResponse } from "@interfaces/index.interfaces"

interface Props {
    conversation: Conversation
}

export default function MessageList( { conversation }: Props ){
    //hooks
    const { user }          = useAuthState()
    const messageListRef    = useRef<HTMLDivElement>( null )
    const [page, setPage]   = useState( 1 )
    const messagesQuery     = useGetMessagesQuery(
        { conversationId: conversation?.id!, page }, { skip: ! conversation?.id }
    )
    const [seenAllMessages] = useSeenAllMessagesMutation()

    const { isLoading, isSuccess, isError, data: messagesData } = messagesQuery || {}
    const { items: messages = [], nextPage }                    = messagesData || {}
    const error                                                 = messagesQuery.error as ErrorResponse || {}
    const participant                                           = conversation.user1.id === user?.id ? conversation.user2 : conversation.user1
    const lastMessage                                           = messages[0]

    useEffect( () => {
        if( isSuccess && ! lastMessage?.isMeSender && ! lastMessage?.seenAt ){
            seenAllMessages( conversation.id )
        }
    }, [messages, isSuccess, lastMessage?.isMeSender] )

    function scrollToBottom(){
        if( messageListRef && messageListRef.current ){
            const element     = messageListRef.current
            element.scrollTop = element.scrollHeight
        }
    }

    const [moreLoadRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! nextPage,
        onLoadMore: () => setPage( nextPage! )
    } )

    //decide content
    let content = null
    if( isLoading ){
        content = <ChatSkeleton/>
    } else if( isSuccess && messages?.length === 0 ){
        content = <div className="h-full flex justify-center items-center">
            <h4 className="text-gray-700 text-lg">No messages</h4>
        </div>
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && messages.length > 0 ){
        content = messages.map( ( message: Message, index: number ) => (
            <MessageItem
                key={ message.id }
                message={ message }
                participant={ participant }
                prevMessage={ index === 0 ? null : messages[index - 1] }
                isLastMessage={ 0 === index }
            />
        ) )
    }

    return (
        <div ref={ messageListRef } className="h-full overflow-y-auto flex flex-col-reverse mb-[60px] scrollbar-hide">
            { content }

            { !! nextPage ? (
                <div className="py-[60px]" ref={ moreLoadRef }>
                    <Loading size={ 50 }/>
                </div>
            ) : null }
        </div>
    )
}