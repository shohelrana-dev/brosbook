import React, { useEffect, useRef } from 'react'
import SingleMessage from "@components/messages/MessageBox/SingleMessage"
import { useGetMessagesQuery } from "@services/conversationApi"
import Loading from "@components/common/Loading"
import { Conversation, Message } from "@interfaces/conversation.interfaces"
import { io } from "socket.io-client"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import useCurrentUser from "@hooks/useCurrentUser";

interface Props {
    conversation: Conversation
}

function MessageList( { conversation }: Props ){
    //hooks
    const { user }                                              = useCurrentUser()
    const { items: messages, isLoading, setItems: setMessages } = useGetInfiniteListQuery<Message>(
        useGetMessagesQuery, { conversationId: conversation?.id! }
    )

    useEffect( () => {
        const socket = io( process.env.NEXT_PUBLIC_API_URL! )

        if( conversation ){
            socket.on( `new_message_${ conversation.id }`, addMessage )

            socket.on( `new_reaction_${ conversation.id }`, updateMessage )
        }

        if( socket ) return () => {
            socket.close()
        }
    }, [conversation] )

    function addMessage( message: Message ){
        message.isMeSender = user?.id === message.sender.id

        setMessages( ( prevMessages: Message[] ) => {
            return [message, ...prevMessages]
        } )
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

    return (
        <div className="overflow-y-scroll h-full scrollbar-hide flex flex-col-reverse mb-3">

            { isLoading ? <Loading/> : null }

            { ( messages && messages.length > 0 ) ? messages.map( ( message: Message, index: number ) => (
                <SingleMessage key={ message.id } message={ message }
                               prevMessage={ index === 0 ? null : messages[index - 1] }/>
            ) ) : null }

            { ! isLoading && messages.length < 1 ? (
                <div className="h-full flex justify-center items-center">
                    <h4 className="text-gray-700 text-lg">No chatting yet</h4>
                </div>
            ) : null }
        </div>
    )
}

export default MessageList