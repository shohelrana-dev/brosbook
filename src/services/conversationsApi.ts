import { baseApi } from "./baseApi"
import { Conversation, Message } from "@interfaces/conversation.interfaces"
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
            providesTags: ['Conversations'],
            onCacheEntryAdded: async( arg, api ) => {
                const { cacheDataLoaded, cacheEntryRemoved, updateCachedData, getState, dispatch } = api
                const rootState                                                                    = getState() as RootState
                const currentUser                                                                  = rootState?.auth?.user

                const updateConversationLastMessage = ( message: Message ) => {
                    console.log( message )
                    message.isMeSender = message.sender.id === currentUser?.id

                    updateCachedData( ( draft ) => {
                        const conversation = draft.items.find( ( c ) => c.id === message.conversation?.id )
                        if( conversation?.id ){
                            conversation.lastMessage = message
                        } else{
                            dispatch( conversationsApi.util.invalidateTags( ["Conversations"] ) )
                        }
                    } )
                }

                try {
                    const { data: conversationData } = await cacheDataLoaded

                    conversationData.items.map( ( { id } ) => {
                        socket.on( `message.new.${ id }`, updateConversationLastMessage )
                        socket.on( `message.seen.${ id }`, updateConversationLastMessage )
                    } )

                } catch ( err ) {
                    await cacheEntryRemoved
                    socket.close()
                    throw err
                }
            },
            ...listQueryExtraDefinitions
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
                method: 'PUT',
                body: { participantId }
            } ),
            invalidatesTags: ['Conversations']
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