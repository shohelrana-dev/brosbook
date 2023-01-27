import React, { useEffect, useRef } from 'react'
import SingleMessage from "@components/messages/MessageBox/SingleMessage"
import { useGetMessagesQuery } from "@services/conversationApi"
import Loading from "@components/common/Loading"
import { Conversation, Message } from "@interfaces/conversation.interfaces"
import { io } from "socket.io-client"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import useAuthState from "@hooks/useAuthState"
import useInfiniteScroll from "react-infinite-scroll-hook"
import InfiniteScroll from 'react-infinite-scroller'

interface Props {
    conversation: Conversation
}

export default function MessageList( { conversation }: Props ){
    //hooks
    const { user }       = useAuthState()
    const messageListRef = useRef<HTMLDivElement>( null )
    const {
              items: messages,
              isLoading,
              setItems: setMessages,
              hasMoreItem,
              loadMoreItem,
              isFetching
          }              = useGetInfiniteListQuery<Message>(
        useGetMessagesQuery, { conversationId: conversation?.id!, limit: 15 }
    )

    useEffect( () => {
        const socket = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )

        if( conversation ){
            socket.on( `new_message_${ conversation.id }`, addMessage )

            socket.on( `new_reaction_${ conversation.id }`, updateMessage )
        }

        if( socket ) return () => {
            socket.close()
        }
    }, [conversation, user] )

    function addMessage( message: Message ){
        message.isMeSender = user?.id === message.sender.id

        setMessages( ( prevMessages: Message[] ) => {
            return [message, ...prevMessages]
        } )
        scrollToBottom()
    }

    function updateMessage( message: Message ){
        message.isMeSender = user?.id === message.sender.id

        setMessages( ( prevMessages: Message[] ) => {
            const index        = prevMessages.findIndex( ( msg ) => msg.id === message.id )
            const newMessages  = [...prevMessages]
            newMessages[index] = message

            return newMessages
        } )
    }

    function scrollToBottom(){
        if( messageListRef && messageListRef.current ){
            const element = messageListRef.current
            element.scroll( {
                top: element.scrollHeight,
                left: 0,
                behavior: "smooth"
            } )
        }
    }

    const [moreLoadRef] = useInfiniteScroll( {
        loading: isLoading || isFetching,
        hasNextPage: hasMoreItem,
        onLoadMore: loadMoreItem,
    } )

    return (
        <div ref={ messageListRef } className="overflow-y-auto flex flex-col-reverse mb-[60px] scrollbar-hide">
            { isLoading || isFetching ? <Loading size={ 50 }/> : null }

            { ( messages && messages.length > 0 ) ? messages.map( ( message: Message, index: number ) => (
                <SingleMessage key={ message.id } message={ message }
                               prevMessage={ index === 0 ? null : messages[index - 1] }/>
            ) ) : null }


            { messages?.length < 1 && ! isLoading && ! isFetching ? (
                <div className="h-full flex justify-center items-center">
                    <h4 className="text-gray-700 text-lg">No chatting yet</h4>
                </div>
            ) : null }

            { hasMoreItem ? (
                <div className="py-[60px]" ref={ moreLoadRef }>
                    <Loading size={ 50 }/>
                </div>
            ) : null }
        </div>
    )
}