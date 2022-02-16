import { Dispatch }                        from "redux"
import { Conversation, Message, Reaction } from "@interfaces/chat.interfaces"
import api                                 from "@api/index"
import {
    setLoadingMessages,
    setLoadingConversations,
    setConversations,
    setMessages,
    setCurrentConversation,
    addNewReaction,
    addNewMessage
}                                          from "@slices/chatSlice"

export const fetchConversationsAction = () => async ( dispatch: Dispatch ) => {
    dispatch( setLoadingConversations() )

    try {
        //api call
        const { data } = await api.chat.fetchConversations()

        //set conversations on state
        dispatch( setConversations( data.conversations ) )

    } catch ( err ) {
        console.log( err )
    }
}

export const fetchMessagesAction = ( identifier: string ) => async ( dispatch: Dispatch ) => {
    dispatch( setLoadingMessages() )

    try {
        //api call
        const { data } = await api.chat.fetchMessages( identifier )

        //set messages on state
        dispatch( setMessages( data.messages ) )
    } catch ( err ) {
        console.log( err )
    }
}

export const setCurrentConversationAction = ( conversation: Conversation ) => async ( dispatch: Dispatch ) => {
    dispatch( setCurrentConversation( conversation ) )
}

export const receiveMessageAction = ( message: Message ) => async ( dispatch: Dispatch ) => {
    //add new message on state
    dispatch( addNewMessage( message ) )
}

export const receiveReactionAction = ( reaction: Reaction ) => async ( dispatch: Dispatch ) => {
    //add new reaction on state
    dispatch( addNewReaction( reaction ) )
}