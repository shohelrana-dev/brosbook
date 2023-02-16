import { baseApi } from "./baseApi"
import { Conversation, Message } from "@interfaces/conversation.interfaces"
import { ListResponse, Media } from "@interfaces/index.interfaces"

export const conversationApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getConversations: build.query<ListResponse<Conversation>, { page?: number, limit?: number }>( {
            query: ( params ) => ( {
                url: `/conversations`,
                params
            } ),
            providesTags: ['Conversation']
        } ),

        getConversationById: build.query<Conversation, string>( {
            query: ( conversationId ) => ( {
                url: `/conversations/${ conversationId }`,
            } )
        } ),

        getConversationByParticipantId: build.query<Conversation, string>( {
            query: ( participantId ) => ( {
                url: `/conversations/by/participant_id/${ participantId }`
            } )
        } ),

        getUnreadConversationsCount: build.query<{ count: number }, void>( {
            query: () => ( `/conversations/unread_count` )
        } ),

        createConversation: build.mutation<Conversation, string>( {
            query: ( participantId ) => ( {
                url: `/conversations`,
                method: 'PUT',
                body: { participantId }
            } ),
            invalidatesTags: ['Conversation']
        } ),

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
            invalidatesTags: ['Message', "Conversation"]
        } ),

        sendReaction: build.mutation<Message, { messageId: string, conversationId: string, name: string }>( {
            query: ( { conversationId, messageId, ...params } ) => ( {
                url: `/conversations/${ conversationId }/messages/${ messageId }/reactions`,
                method: "POST",
                body: params
            } ),
            invalidatesTags: ['Message']
        } ),

        seenAllMessages: build.mutation<Message, string>( {
            query: ( conversationId ) => ( {
                url: `/conversations/${ conversationId }/messages/seen_all`,
                method: "POST"
            } ),
            invalidatesTags: ['Message', 'Conversation']
        } ),

        getConversationMediaList: build.query<ListResponse<Media>, { conversationId: string, page?: number, limit?: number }>( {
            query: ( { conversationId, ...params } ) => ( {
                url: `/conversations/${ conversationId }/media`,
                params
            } ),
            providesTags: ['Message']
        } )

    } ),
} )

export const {
                 useGetConversationsQuery,
                 useCreateConversationMutation,
                 useGetConversationByParticipantIdQuery,
                 useLazyGetConversationByParticipantIdQuery,
                 useGetConversationByIdQuery,
                 useGetUnreadConversationsCountQuery,
                 useGetMessagesQuery,
                 useSendMessageMutation,
                 useSendReactionMutation,
                 useSeenAllMessagesMutation,
                 useGetConversationMediaListQuery
             } = conversationApi