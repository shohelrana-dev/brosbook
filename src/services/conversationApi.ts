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
                 useGetConversationMediaListQuery
             } = conversationApi