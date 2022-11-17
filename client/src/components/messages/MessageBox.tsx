import React, { Fragment, useEffect } from 'react'
import Link                           from "next/link"
import { useDispatch, useSelector }   from "react-redux"

import Avatar                                          from "@components/common/Avatar"
import MessageList                                     from "@components/messages/MessageBox/MessageList"
import { RootState }                                   from "../../store"
import { receiveMessageAction, receiveReactionAction } from "@actions/chatActions"
import moment                from "moment"
import { socket }            from "@components/common/AuthCheck"
import { Message, Reaction } from "@interfaces/chat.interfaces"
import ParticipantSkeleton
                                                       from "@components/messages/MessageBox/Skeletons/ParticipantSkeleton"
import MessageForm                                     from "@components/messages/MessageBox/MessageForm"
import { User }                                        from "@interfaces/user.interfaces"

export default function MessageBox() {
    //hooks
    const { currentConversation } = useSelector( ( state: RootState ) => state.chat )
    const { user }                = useSelector( ( state: RootState ) => state.auth )
    const dispatch                = useDispatch()

    useEffect( eventsListener, [ dispatch, user ] )

    function eventsListener() {
        //listeners
        socket.on( 'receive_message', receiveMessageListener )
        socket.on( 'receive_reaction', receiveReactionListener )
        socket.on( 'socket_error', socketErrorListener )

        function receiveMessageListener( message: Message ) {
            dispatch( receiveMessageAction( message ) )
        }

        function receiveReactionListener( reaction: Reaction ) {
            dispatch( receiveReactionAction( reaction ) )
        }

        function socketErrorListener( errMsg: string ) {
            console.error( 'socket_error:', errMsg )
        }

        // unsubscribe from event for preventing memory leaks
        return () => {
            socket.off( 'receive_message', receiveMessageListener )
            socket.off( 'receive_reaction', receiveReactionListener )
            socket.off( 'socket_error', socketErrorListener )
        }
    }

    const participant = currentConversation?.participant || {} as User

    return (
        <Fragment>

            {/*User information*/ }
            <div className="box py-5 px-8 flex relative">
                { !currentConversation && <ParticipantSkeleton/> }

                { participant && Object.keys( participant ) && (
                    <Fragment>
                        <div className="mr-4">
                            <Avatar
                                src={ participant.photo }
                                online={ participant.active === 1 }
                                alt={ participant.fullName }
                            />
                        </div>
                        <div className="mr-3">
                            <h5 className="font-medium text-gray-800">
                                <Link href={ `/${ participant.username }` }>
                                    <a>{ participant.fullName }</a>
                                </Link>
                            </h5>
                            <p className="text-gray-500 text-sm">
                                { participant.active === 1 ? 'Active now' : 'Active ' + moment( participant.updatedAt ).fromNow( true ) }
                            </p>
                        </div>
                    </Fragment>
                ) }
            </div>

            {/*Messages*/ }
            <MessageList/>

            {/*message form*/ }
            <MessageForm/>

        </Fragment>
    )
}