import { baseApi } from "./baseApi"
import { Conversation } from "@interfaces/conversation.interfaces"
import { ListResponse, Media } from "@interfaces/index.interfaces"
import { io } from "socket.io-client"
import { RootState } from "@store/index"
import listQueryExtraDefinitions from "@utils/listQueryExtraDefinitions"

const conversationsPerPage = process.env.NEXT_PUBLIC_CONVERSATIONS_PER_PAGE
const mediaPerPage         = process.env.NEXT_PUBLIC_MEDIA_PER_PAGE
const socket               = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )

export const conversationsApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getConversations: build.query<ListResponse<Conversation>, number>( {
            query: ( page ) => ( {
                url: `/conversations`,
                params: { page, limit: conversationsPerPage }
            } ),
            providesTags: [{type: "Conversation", id: "LIST"}],
            ...listQueryExtraDefinitions
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
            query: () => ( `/conversations/unread_count` ),
            onCacheEntryAdded: async( arg, api ) => {
                const { cacheDataLoaded, cacheEntryRemoved, updateCachedData, getState } = api
                const rootState                                                          = getState() as RootState
                const currentUser                                                        = rootState?.auth?.user

                try {
                    await cacheDataLoaded

                    socket.on( `conversation.unread.count.${ currentUser?.id }`, ( count: number ) => {
                        updateCachedData( ( draft ) => {
                            draft.count = count
                        } )
                    } )
                } catch ( err ) {
                    await cacheEntryRemoved
                    socket.close()
                    throw err
                }
            }
        } ),

        createConversation: build.mutation<Conversation, string>( {
            query: ( participantId ) => ( {
                url: `/conversations`,
                method: 'POST',
                body: { participantId }
            } ),
            onQueryStarted: async (arg, api) => {
                try {
                    const {data} = await api.queryFulfilled

                    //@ts-ignore
                    api.dispatch( conversationsApi.util.updateQueryData( "getConversations", undefined as any,  (draft: ListResponse<Conversation> ) =>{
                        draft.items.unshift(data)
                    } ) )
                }catch (e) {
                    console.log(e)
                }
            }
        } ),

        getConversationMediaList: build.query<ListResponse<Media>, { conversationId: string, page: number }>( {
            query: ( { conversationId, page } ) => ( {
                url: `/conversations/${ conversationId }/media`,
                params: { page, limit: mediaPerPage }
            } ),
            providesTags: ['ConversationMedia'],
            ...listQueryExtraDefinitions
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
             } = conversationsApi