// noinspection TypeScriptValidateJSTypes

import { baseApi } from "./baseApi"
import { Message } from "@interfaces/conversation.interfaces"
import {ListResponse, Media} from "@interfaces/index.interfaces"
import { io } from "socket.io-client"
import { RootState } from "@store/index"
import listQueryExtraDefinitions from "@utils/listQueryExtraDefinitions"
import {conversationsApi} from "@services/conversationsApi"

const socket          = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )
const messagesPerPage = process.env.NEXT_PUBLIC_MESSAGES_PER_PAGE

export const messagesApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getMessages: build.query<ListResponse<Message>, { conversationId: string, page: number }>( {
            query: ( { conversationId, page } ) => ( {
                url: `/conversations/${ conversationId }/messages`,
                params: { page, limit: messagesPerPage }
            } ),
            onCacheEntryAdded: async( arg, api ) => {
                const { updateCachedData, cacheEntryRemoved, cacheDataLoaded, getState, dispatch } = api
                const currentUser                                                        = ( getState() as RootState )?.auth?.user

                try {
                    await cacheDataLoaded

                    const addNewMessage = ( message: Message ) => {
                        message.isMeSender = message.sender.id === currentUser?.id

                        updateCachedData( ( draft ) => {
                            draft.items.unshift( message )
                        } )

                        //console.log(conversationsApi.endpoints.getConversationMediaList.select({conversationId: message.conversation?.id})(getState()))
                        if(message.image){
                            dispatch(conversationsApi.util.updateQueryData('getConversationMediaList', {conversationId: message.conversation?.id} as any, (draft: ListResponse<Media>) => {
                                draft.items.unshift(message.image!)
                            }))
                        }
                    }

                    const updateMessage = ( message: Message ) => {
                        message.isMeSender = message.sender.id === currentUser?.id

                        updateCachedData( ( draft ) => {
                            const index        = draft.items.findIndex( ( item ) => item.id === message.id )
                            draft.items[index] = message
                        } )
                    }

                    socket.on( `message.new.${ arg.conversationId }`, addNewMessage )
                    socket.on( `message.update.${ arg.conversationId }`, updateMessage )
                    socket.on( `message.seen.${ arg.conversationId }`, updateMessage )
                } catch ( err ) {
                    await cacheEntryRemoved
                    socket.close()
                    throw err
                }
            },
            ...listQueryExtraDefinitions
        } ),

        sendMessage: build.mutation<Message, FormData>( {
            query: ( data ) => ( {
                url: `/conversations/${ data.get( 'conversationId' ) }/messages`,
                method: "POST",
                body: data
            } )
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
            } )
        } )
    } ),
} )

export const {
                 useGetMessagesQuery,
                 useSendMessageMutation,
                 useSendReactionMutation,
                 useSeenAllMessagesMutation
             } = messagesApi