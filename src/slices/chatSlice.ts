import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { Conversation, Message } from "@interfaces/conversation.interfaces"
import { conversationApi } from "@services/conversationApi"

interface ChatState {
    currentConversation: Conversation | null
    conversations: Conversation[]
    messages: Message[]
}

const initialState: ChatState = {
    currentConversation: null,
    conversations: [],
    messages: []
}

export const chatSlice = createSlice( {
    name: 'chat',
    initialState,
    reducers: {
        setCurrentConversation: ( state, { payload }: PayloadAction<Conversation> ) => {
            state.currentConversation = payload
        },
        setConversations: ( state, { payload }: PayloadAction<Conversation[]> ) => {
            state.conversations = payload
        },
        setMessages: ( state, { payload }: PayloadAction<Message[]> ) => {
            state.messages = payload
        },
        addMessage: ( state, { payload }: PayloadAction<Message> ) => {
            state.messages.unshift( payload )
        },
        updateMessage: ( state, { payload }: PayloadAction<Message> ) => {
            const index           = state.messages.findIndex( ( msg ) => msg.id === payload.id )
            state.messages[index] = payload
        }
    },
    extraReducers: ( builder ) => {
        builder.addMatcher( conversationApi.endpoints.getConversations.matchFulfilled, ( state, action ) => {
            state.conversations = action.payload.items
        } )

        builder.addMatcher( conversationApi.endpoints.getConversationById.matchFulfilled, ( state, action ) => {
            state.currentConversation = action.payload
        } )

        builder.addMatcher( conversationApi.endpoints.getMessages.matchFulfilled, ( state, { payload } ) => {
            state.messages = payload.items
        } )
    }
} )

export const selectChatState = ( state: RootState ) => state.chat

export const { setMessages, setConversations, setCurrentConversation, updateMessage, addMessage } = chatSlice.actions