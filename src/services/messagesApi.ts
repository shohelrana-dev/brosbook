import { baseApi } from "./baseApi"
import { Message } from "@interfaces/conversation.interfaces"
import { ListResponse } from "@interfaces/index.interfaces"

const messagesPerPage = process.env.NEXT_PUBLIC_MESSAGES_PER_PAGE

export const messagesApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getMessages: build.query<ListResponse<Message>, { conversationId: string, page?: number }>( {
            query: ( { conversationId, page } ) => ( {
                url: `/conversations/${ conversationId }/messages`,
                params: { page, limit: messagesPerPage }
            } ),
            providesTags: ['Messages']
        } ),

        sendMessage: build.mutation<Message, FormData>( {
            query: ( formData ) => ( {
                url: `/conversations/${ formData.get( 'conversationId' ) }/messages`,
                method: "POST",
                body: formData
            } ),
            invalidatesTags: ['Conversations']
        } ),

        sendReaction: build.mutation<Message, { messageId: string, conversationId: string, name: string }>( {
            query: ( { conversationId, messageId, ...data } ) => ( {
                url: `/conversations/${ conversationId }/messages/${ messageId }/reactions`,
                method: "POST",
                body: data
            } )
        } ),

        seenAllMessages: build.mutation<Message, string>( {
            query: ( conversationId ) => ( {
                url: `/conversations/${ conversationId }/messages/seen_all`,
                method: "POST"
            } ),
            invalidatesTags: ['Conversations']
        } )
    } ),
} )

export const {
                 useGetMessagesQuery,
                 useSendMessageMutation,
                 useSendReactionMutation,
                 useSeenAllMessagesMutation
             } = messagesApi