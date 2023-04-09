import { baseApi } from "./baseApi"
import { Conversation } from "@interfaces/conversation.interfaces"
import { ListResponse, Media } from "@interfaces/index.interfaces"

const conversationsPerPage = process.env.NEXT_PUBLIC_CONVERSATIONS_PER_PAGE

export const conversationApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getConversations: build.query<ListResponse<Conversation>, number>( {
            query: ( page ) => ( {
                url: `/conversations`,
                params: { page, limit: conversationsPerPage }
            } ),
            providesTags: ['Conversations']
        } ),

        getConversationById: build.query<Conversation, string>( {
            query: ( conversationId ) => ( {
                url: `/conversations/${ conversationId }`,
            } ),
            providesTags: ['Conversation']
        } ),

        getConversationByParticipantId: build.query<Conversation, string>( {
            query: ( participantId ) => ( {
                url: `/conversations/by/participant_id/${ participantId }`
            } ),
            providesTags: ["Conversation"]
        } ),

        getUnreadConversationsCount: build.query<{ count: number }, void>( {
            query: () => ( `/conversations/unread_count` ),
            providesTags: ['Conversations']
        } ),

        createConversation: build.mutation<Conversation, string>( {
            query: ( participantId ) => ( {
                url: `/conversations`,
                method: 'PUT',
                body: { participantId }
            } ),
            invalidatesTags: ['Conversations']
        } ),

        getConversationMediaList: build.query<ListResponse<Media>, { conversationId: string, page?: number, limit?: number }>( {
            query: ( { conversationId, ...params } ) => ( {
                url: `/conversations/${ conversationId }/media`,
                params
            } ),
            providesTags: ['ConversationMedia']
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