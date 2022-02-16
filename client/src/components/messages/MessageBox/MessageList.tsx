import React, { useEffect, useRef } from 'react'
import moment                       from "moment"
import { useRouter }                from "next/router"
import { useDispatch, useSelector } from "react-redux"

import SingleMessage           from "@components/messages/MessageBox/SingleMessage"
import { RootState }           from "@store/index"
import { fetchMessagesAction } from "@actions/chatActions"
import { Message }             from "@interfaces/chat.interfaces"
import MessagesSkeleton        from "@components/messages/MessageBox/Skeletons/MessagesSkeleton"

function MessageList() {
    //hooks
    const messagesDivRef                                       = useRef<HTMLDivElement>( null )
    const { messages, currentConversation, isLoadingMessages } = useSelector( ( state: RootState ) => state.chat )
    const { user: currentUser }                                = useSelector( ( state: RootState ) => state.auth )
    const router                                               = useRouter()
    const dispatch                                             = useDispatch()

    useEffect( loadMessages, [ dispatch, router ] )
    useEffect( scrollToBottom, [ messagesDivRef ] )

    function loadMessages() {
        const identifier = router.query.identifier as string
        if ( identifier && identifier !== 'undefined' ) {
            dispatch( fetchMessagesAction( identifier ) )
        }
    }

    //scroll message box to bottom
    function scrollToBottom() {
        if ( messagesDivRef && messagesDivRef.current ) {
            messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight
        }
    }

    //Make Grouped Message per user
    let messageGroup: Message[]      = []
    let isEndGroupedMessage: boolean = false

    function makeGroupedMessage( msg: Message, i: number, messages: Message[] ) {
        const prevMsg = i > 0 ? messages[i - 1] : {} as Message
        const minutes = moment( prevMsg.createdAt ).diff( msg.createdAt, 'minutes' )

        if ( prevMsg.senderId === msg.senderId ) {
            isEndGroupedMessage = false
            if ( minutes <= 5 ) {
                if ( messageGroup.length < 1 ) {
                    messageGroup.unshift( prevMsg )
                }
                messageGroup.unshift( msg )
            } else {
                messageGroup        = []
                isEndGroupedMessage = true
            }
        } else {
            messageGroup        = []
            isEndGroupedMessage = true
        }
    }

    return (
        <div ref={ messagesDivRef } className="overflow-y-scroll h-full scrollbar-hide flex flex-col-reverse">

            { isLoadingMessages && <MessagesSkeleton/> }

            { !isLoadingMessages && messages && messages.map( ( msg, i, array ) => {
                makeGroupedMessage( msg, i, array )
                if ( !isEndGroupedMessage ) return
                return <SingleMessage
                    key={ msg.id }
                    message={ msg }
                    currentUser={ currentUser }
                    participant={ currentConversation?.participant }
                    group={ messageGroup }
                />
            } ) }
            { !isLoadingMessages && messages.length < 1 && (
                <div className="h-full flex justify-center items-center">
                    <h4 className="text-gray-700 text-lg">No chatting yet</h4>
                </div>
            ) }
        </div>
    )
}

export default MessageList