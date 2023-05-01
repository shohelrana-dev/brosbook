// noinspection TypeScriptValidateJSTypes

import { baseApi } from "./baseApi"
import {Conversation, Message, MessageType} from "@interfaces/conversation.interfaces"
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

                    const updateConversationLastMessage = (message: Message) => {
                        dispatch(conversationsApi.util.updateQueryData('getConversations', undefined as any, (draft: ListResponse<Conversation>) => {
                            const conversation = draft.items.find( ( c ) => c.id === message.conversation?.id )
                            if( conversation?.id ){
                                conversation.lastMessage = message

                                const index  = draft.items.indexOf(conversation)
                                if(index !== 0 && index !== -1){
                                    draft.items.unshift(draft.items.splice(index, 1)[0])
                                }
                            } else{
                                dispatch( conversationsApi.util.invalidateTags( [{type: "Conversation", id: "LIST"}] ) )
                            }
                        }))
                    }

                    const handleNewMessageEvent = ( message: Message ) => {
                        message.isMeSender = message.sender.id === currentUser?.id

                        updateCachedData( ( draft ) => {
                            if(message.isMeSender){
                                draft.items.shift()
                            }
                            draft.items.unshift( message )
                        } )

                        //update conversation media list
                        if(message.image){
                            dispatch(conversationsApi.util.updateQueryData('getConversationMediaList', {conversationId: message.conversation?.id} as any, (draft: ListResponse<Media>) => {
                                draft.items.unshift(message.image!)
                            }))
                        }

                        //update conversation last message on conversations
                        updateConversationLastMessage(message)
                    }

                    const handleUpdateMessageEvent = ( message: Message ) => {
                        message.isMeSender = message.sender.id === currentUser?.id

                        updateCachedData( ( draft ) => {
                            const index        = draft.items.findIndex( ( item ) => item.id === message.id )
                            draft.items[index] = message
                        } )

                        //update conversation last message on conversations
                        updateConversationLastMessage(message)
                    }

                    socket.on( `message.new.${ arg.conversationId }`, handleNewMessageEvent )
                    socket.on( `message.update.${ arg.conversationId }`, handleUpdateMessageEvent )
                    socket.on( `message.seen.${ arg.conversationId }`, handleUpdateMessageEvent )
                } catch ( err ) {
                    await cacheEntryRemoved
                    socket.close()
                    throw err
                }
            },
            ...listQueryExtraDefinitions
        } ),

        sendMessage: build.mutation<Message, {conversationId: string, data: {type: MessageType, body?: string, image?: Blob}}>( {
            query: ({conversationId, data} ) => {
                const body = new FormData()
                body.append('type', data.type)
                if(data.body) body.append('body', data.body)
                if(data.image) body.append('image', data.image)

                return {
                    url: `/conversations/${ conversationId }/messages`,
                    method: "POST",
                    body,
                }
            },
            onQueryStarted: async (arg, {dispatch, queryFulfilled, getState}) => {
                const currentUser = (getState() as RootState).auth.user

                //optimistic cache update
                const patchResult = dispatch( messagesApi.util.updateQueryData( "getMessages", {conversationId: arg.conversationId} as any, ( draft: ListResponse<Message> ) => {
                    draft.items.unshift({
                        ...arg.data as any,
                        id: Date.now(),
                        image: arg.data.image ? {url: URL.createObjectURL(arg.data.image)} as Media : undefined,
                        sender: currentUser,
                        isMeSender: true
                    })
                } ) )

                try {
                    await queryFulfilled
                }catch (err){
                    patchResult.undo()
                    throw err
                }
            }
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