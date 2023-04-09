import React, { useEffect, useRef, useState } from 'react'
import MessageItem from "@components/messages/MessageBox/MessageItem"
import { useGetMessagesQuery, useSeenAllMessagesMutation } from "@services/messagesApi"
import Loading from "@components/global/Loading"
import { Conversation, Message } from "@interfaces/conversation.interfaces"
import { io } from "socket.io-client"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import useAuthState from "@hooks/useAuthState"
import useInfiniteScroll from "react-infinite-scroll-hook"
import ChatSkeleton from "@components/skeletons/ChatSkeleton"
import Error from "@components/global/Error"
import { ErrorResponse } from "@interfaces/index.interfaces";

interface Props {
    conversation: Conversation
}

export default function MessageList( { conversation }: Props ){
    //hooks
    const { user }          = useAuthState()
    const messageListRef    = useRef<HTMLDivElement>( null )
    const [page, setPage]   = useState( 1 )
    const messagesQuery     = useGetMessagesQuery( {
        conversationId: conversation?.id!,
        page
    }, { skip: ! conversation?.id } )
    const [seenAllMessages] = useSeenAllMessagesMutation()

    const { isLoading, isSuccess, isError, data: messagesData } = messagesQuery || {}
    const { items: messages = [], nextPage }                    = messagesData || {}
    const error                                                 = messagesQuery.error as ErrorResponse || {}
    const participant                                           = conversation.user1.id === user?.id ? conversation.user2 : conversation.user1

    useEffect( () => {
        if( ! conversation?.id || ! user?.id ) return

        const socket = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )

        socket.on( 'connect', () => {
            socket.on( `message.new.${ conversation.id }`, addMessage )

            socket.on( `message.update.${ conversation.id }`, updateMessage )

            socket.on( `message.seen.${ conversation.id }.${ user.id }`, updateMessage )
        } )

        if( socket ) return () => {
            socket.close()
        }
    }, [conversation, user, participant] )

    useEffect( () => {
        seenAllMessages( conversation.id )
    }, [messages] )

    function addMessage( message: Message ){
        message.isMeSender = user?.id === message.sender.id

        //add message on cache

        setTimeout( () => {
            scrollToBottom()
        }, 500 )
    }

    function updateMessage( message: Message ){
        message.isMeSender = user?.id === message.sender.id

        //update message on cache
    }

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