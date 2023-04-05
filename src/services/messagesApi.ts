import { baseApi } from "./baseApi"
import { Conversation, Message } from "@interfaces/conversation.interfaces"
import { ListResponse } from "@interfaces/index.interfaces"

export const messagesApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getMessages: build.query<ListResponse<Message>, { conversationId: string, page?: number, limit?: number }>( {
            query: ( { conversationId, ...params } ) => ( {
                url: `/conversations/${ conversationId }/messages`,
                params
            } ),
            providesTags: ['Message']
        } ),

        sendMessage: build.mutation<Message, FormData>( {
            query: ( formData ) => ( {
                url: `/conversations/${ formData.get( 'conversationId' ) }/messages`,
                method: "POST",
                body: formData
            } ),
            invalidatesTags: ['Conversation']
        } ),

        sendReaction: build.mutation<Message, { messageId: string, conversationId: string, name: string }>( {
            query: ( { conversationId, messageId, ...params } ) => ( {
                url: `/conversations/${ conversationId }/messages/${ messageId }/reactions`,
                method: "POST",
                body: params
            } )
        } ),

        seenAllMessages: build.mutation<Message, string>( {
            query: ( conversationId ) => ( {
                url: `/conversations/${ conversationId }/messages/seen_all`,
                method: "POST"
            } ),
            invalidatesTags: ['Conversation']
        } )
    } ),
} )

export const {
                 useGetMessagesQuery,
                 useSendMessageMutation,
                 useSendReactionMutation,
                 useSeenAllMessagesMutation
             } = messagesApi