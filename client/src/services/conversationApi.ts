import { baseApi } from "./baseApi"
import { Conversation, Message } from "@interfaces/conversation.interfaces"
import { ListResponse, Media } from "@interfaces/index.interfaces"

export const conversationApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getConversations: build.query<ListResponse<Conversation>, { page?: number, limit?: number }>( {
            query: ( params ) => ( {
                url: `/conversations`,
                params
            } )
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

        createConversation: build.mutation<Conversation, string>( {
            query: ( participantId ) => ( {
                url: `/conversations`,
                method: 'PUT',
                body: { participantId }
            } )
        } ),

        getMessages: build.query<ListResponse<Message>, { conversationId: string, page?: number, limit?: number }>( {
            query: ( { conversationId, ...params } ) => ( {
                url: `/conversations/${ conversationId }/messages`,
                params
            } )
        } ),

        sendMessage: build.mutation<Message, FormData>( {
            query: ( formData ) => ( {
                url: `/conversations/${ formData.get( 'conversationId' ) }/messages`,
                method: "POST",
                body: formData
            } )
        } ),

        sendReaction: build.mutation<Message, { messageId: string, conversationId: string, name: string }>( {
            query: ( { conversationId, messageId, ...params } ) => ( {
                url: `/conversations/${ conversationId }/messages/${ messageId }/reactions`,
                method: "POST",
                body: params
            } )
        } ),

        getConversationMediaList: build.query<ListResponse<Media>, { conversationId: string, page?: number, limit?: number }>( {
            query: ( { conversationId, ...params } ) => ( {
                url: `/conversations/${ conversationId }/media`,
                params
            } )
        } )

    } ),
} )

export const {
                 useGetConversationsQuery,
                 useCreateConversationMutation,
                 useGetConversationByParticipantIdQuery,
                 useLazyGetConversationByParticipantIdQuery,
                 useGetConversationByIdQuery,
                 useGetMessagesQuery,
                 useSendMessageMutation,
                 useSendReactionMutation,
                 useGetConversationMediaListQuery
             } = conversationApi