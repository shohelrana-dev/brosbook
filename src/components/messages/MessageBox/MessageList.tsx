import React, { useEffect, useRef } from 'react'
import SingleMessage from "@components/messages/MessageBox/SingleMessage"
import { useGetMessagesQuery, useSeenAllMessagesMutation } from "@services/conversationApi"
import Loading from "@components/global/Loading"
import { Conversation, Message } from "@interfaces/conversation.interfaces"
import { io } from "socket.io-client"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import useAuthState from "@hooks/useAuthState"
import useInfiniteScroll from "react-infinite-scroll-hook"

interface Props {
    conversation: Conversation
}

export default function MessageList( { conversation }: Props ){
    //hooks
    const { user }          = useAuthState()
    const messageListRef    = useRef<HTMLDivElement>( null )
    const {
              items: messages,
              isLoading,
              setItems: setMessages,
              hasMoreItem,
              loadMoreItem,
              isSuccess
          }                 = useGetInfiniteListQuery<Message>(
        useGetMessagesQuery, { conversationId: conversation?.id!, limit: 15 }
    )
    const [seenAllMessages] = useSeenAllMessagesMutation()

    const participant = conversation.user1.id === user?.id ? conversation.user2 : conversation.user1

    useEffect( () => {
        const socket = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )

        if( conversation ){
            socket.on( 'connect', () => {
                socket.on( `message.new.${ conversation.id }`, addMessage )

                socket.on( `message.update.${ conversation.id }`, updateMessage )

                socket.on( `message.seen.${ conversation.id }.${ user.id }`, updateMessage )
            } )
        }

        if( socket ) return () => {
            socket.close()
        }
    }, [conversation, user, participant] )

    useEffect( () => {
        seenAllMessages( conversation.id )
    }, [messages] )

    function addMessage( message: Message ){
        message.isMeSender = user?.id === message.sender.id

        setMessages( ( prevMessages: Message[] ) => {
            return [message, ...prevMessages]
        } )
        setInterval( () => {
            scrollToBottom()
        }, 500 )
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
            const element     = messageListRef.current
            element.scrollTop = element.scrollHeight
        }
    }

    const [moreLoadRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: hasMoreItem,
        onLoadMore: loadMoreItem,
    } )

    return (
        <div ref={ messageListRef } className="h-full overflow-y-auto flex flex-col-reverse mb-[60px] scrollbar-hide">
            { isLoading ? <Loading size={ 50 }/> : null }

            { ( messages && messages.length > 0 ) ? messages.map( ( message: Message, index: number ) => (
                <>
                    <SingleMessage
                        key={ message.id }
                        message={ message }
                        participant={ participant }
                        prevMessage={ index === 0 ? null : messages[index - 1] }
                        isLastMessage={ 0 === index }
                    />
                </>
            ) ) : null }


            { ( isSuccess && messages?.length < 1 ) ? (
                <div className="h-full flex justify-center items-center">
                    <h4 className="text-gray-700 text-lg">No chat</h4>
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