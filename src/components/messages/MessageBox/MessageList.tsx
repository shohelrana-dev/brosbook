import React, { useEffect, useRef, useState } from 'react'
import MessageItem from "@components/messages/MessageBox/MessageItem"
import { useGetMessagesQuery, useSeenMessagesMutation } from "@services/messagesApi"
import Loader from "@components/global/Loader"
import { Message } from "@interfaces/conversation.interfaces"
import useAuthState from "@hooks/useAuthState"
import ChatSkeleton from "@components/skeletons/ChatSkeleton"
import Error from "@components/global/Error"
import { ErrorResponse } from "@interfaces/index.interfaces"
import {useParams} from "next/navigation"
import {useGetConversationByIdQuery} from "@services/conversationsApi"
import InfiniteScroll from "react-infinite-scroll-component"


export default function MessageList(){
    //hooks
    const { user }          = useAuthState()
    const {conversationId} = useParams()
    const {data: conversation} = useGetConversationByIdQuery(conversationId as string)
    const messageListRef    = useRef<HTMLDivElement>( null )
    const [page, setPage]   = useState( 1 )
    const messagesQuery     = useGetMessagesQuery(
        { conversationId: conversation?.id!, page }, { skip: ! conversation?.id }
    )
    const [seenMessages] = useSeenMessagesMutation()

    const { isLoading, isSuccess, isError, data: messagesData } = messagesQuery || {}
    const { items: messages = [], nextPage }                    = messagesData || {}
    const error                                                 = messagesQuery.error as ErrorResponse || {}
    const participant                                           = conversation?.user1.id === user?.id ? conversation?.user2 : conversation?.user1
    const lastMessage                                           = messages[0]

    useEffect( () => {
        if( isSuccess && ! lastMessage?.isMeSender && ! lastMessage?.seenAt ){
            seenMessages( conversation?.id! )
        }
    }, [messages, isSuccess, lastMessage?.isMeSender] )

    useEffect(() => {
        scrollToBottom()
    }, [lastMessage])

    function scrollToBottom(){
        if( messageListRef && messageListRef.current ){
            const element     = messageListRef.current
            element.scrollTop = element.scrollHeight
        }
    }

    //decide content
    let content = null
    if( isLoading ){
        content = <ChatSkeleton/>
    } else if( isSuccess && messages?.length === 0 ){
        content = (
        <div className="h-full flex flex-wrap justify-center items-center">
            <h4 className="text-gray-700 text-lg">No messages</h4>
        </div>
        )
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && messages.length > 0 ){
        content = (
            <InfiniteScroll
                next={() => setPage(nextPage!)}
                hasMore={!!nextPage}
                loader={<Loader wrapperClassName={"my-8"}/>}
                dataLength={messages.length}
                scrollableTarget="message-list"
                className="flex flex-col-reverse"
                inverse={true}
            >
                { messages.map((message: Message, index: number) => (
                    <MessageItem
                        key={message.id}
                        message={message}
                        participant={participant!}
                        prevMessage={index === 0 ? null : messages[index - 1]}
                        isLastMessage={0 === index}
                    />
                )) }
            </InfiniteScroll>
        )
    }

    return (
        <div className="relative flex flex-col-reverse overflow-y-auto pt-2" id="message-list" ref={ messageListRef }>
            { content }
        </div>
    )
}