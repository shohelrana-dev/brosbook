import { createSlice, PayloadAction }                 from "@reduxjs/toolkit"
import { ChatState, Conversation, Message, Reaction } from "@interfaces/chat.interfaces"

const initialState: ChatState = {
    isLoadingConversations: false,
    isLoadingMessages: false,
    conversations: [],
    currentConversation: <Conversation>{},
    messages: []
}

export const chatSlice = createSlice( {
    name: 'chat',
    initialState,
    reducers: {
        setLoadingConversations: ( state, { payload }: PayloadAction<void> ) => {
            state.isLoadingConversations = true
        },
        setLoadingMessages: ( state, { payload }: PayloadAction<void> ) => {
            state.isLoadingMessages = true
        },
        setConversations: ( state, { payload }: PayloadAction<Conversation[]> ) => {
            state.conversations          = payload
            state.isLoadingConversations = false
        },
        setCurrentConversation: ( state, { payload }: PayloadAction<Conversation> ) => {
            state.currentConversation = payload
        },
        setMessages: ( state, { payload }: PayloadAction<Message[]> ) => {
            state.messages          = payload
            state.isLoadingMessages = false
        },
        addNewMessage: ( state, { payload }: PayloadAction<Message> ) => {
            //set new message
            state.messages.unshift( payload )

            //set last message in conversation
            const conversation = state.conversations.find( cv => cv.identifier === payload.conversationIdentifier )

            if ( !conversation ) return

            conversation.lastMessage = payload.body
            conversation.updatedAt   = payload.createdAt

            if ( conversation.identifier === state.conversations[0]?.identifier ) return

            state.conversations.splice( state.conversations.indexOf( conversation ), 1 )
            state.conversations.unshift( conversation )
        },
        addNewReaction: ( state, { payload }: PayloadAction<Reaction> ) => {
            const index = state.messages.findIndex( msg => msg.id === payload.messageId )

            const message = state.messages[index]

            let isExists
            if ( message.reactions.length > 0 ) {
                message.reactions.map( ( reaction: Reaction, i ) => {
                    if ( payload.senderId === reaction.senderId ) {
                        message.reactions[i] = payload
                        isExists             = true
                    }
                } )
            }
            if ( isExists !== true ) {
                message.reactions.push( payload )
            }
        }
    }
} )

export const {
                 setLoadingMessages,
                 setLoadingConversations,
                 setConversations,
                 setMessages,
                 setCurrentConversation,
                 addNewMessage,
                 addNewReaction
             } = chatSlice.actions