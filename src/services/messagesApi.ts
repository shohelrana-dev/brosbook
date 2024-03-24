import { Message, MessageType } from '~/interfaces/conversation.interfaces'
import { ListResponse, Media } from '~/interfaces/index.interfaces'
import { conversationsApi } from '~/services/conversationsApi'
import { RootState } from '~/store'
import { MESSAGES_PER_PAGE } from '~/utils/constants'
import listQueryExtraDefinitions from '~/utils/listQueryExtraDefinitions'
import { baseApi } from './baseApi'

interface MessagePayload {
    conversationId: string
    data: {
        type: MessageType
        body?: string
        image?: Blob | null
    }
}

export const messagesApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getMessages: build.query<ListResponse<Message>, { conversationId: string; page: number }>({
            query: ({ conversationId, page }) => ({
                url: `/conversations/${conversationId}/messages`,
                params: { page, limit: MESSAGES_PER_PAGE },
            }),
            ...listQueryExtraDefinitions,
            onCacheEntryAdded: async (arg, api) => {
                const { updateCachedData, cacheEntryRemoved, cacheDataLoaded, getState, dispatch } = api
                const rootState = getState() as RootState
                const currentUser = rootState.auth.user
                const socket = rootState.socket.socket

                try {
                    await cacheDataLoaded

                    const newMessageListener = (data: Message) => {
                        const message = { ...data }
                        message.isMeSender = message.sender.id === currentUser?.id

                        updateCachedData((draft) => {
                            if (message.isMeSender) {
                                draft.items.shift()
                            }
                            draft.items.unshift(message)
                        })

                        //update conversation media list
                        if (message.image) {
                            dispatch(
                                conversationsApi.util.updateQueryData(
                                    'getConversationMediaList',
                                    { conversationId: message.conversation?.id } as any,
                                    (draft: ListResponse<Media>) => {
                                        draft.items.unshift(message.image!)
                                    }
                                )
                            )
                        }
                    }

                    const updateMessageListener = (data: Message) => {
                        const message = { ...data }
                        message.isMeSender = message.sender.id === currentUser?.id

                        updateCachedData((draft) => {
                            const index = draft.items.findIndex((item) => item.id === message.id)
                            draft.items[index] = message
                        })
                    }

                    socket?.on(`message.new`, newMessageListener)
                    socket?.on(`message.update`, updateMessageListener)
                    socket?.on(`message.seen`, updateMessageListener)
                } catch (err) {
                    await cacheEntryRemoved
                    throw err
                }
            },
        }),

        sendMessage: build.mutation<Message, MessagePayload>({
            query: ({ conversationId, data }) => {
                const body = new FormData()
                body.append('type', data.type)
                if (data.body) body.append('body', data.body)
                if (data.image) body.append('image', data.image)

                return {
                    url: `/conversations/${conversationId}/messages`,
                    method: 'POST',
                    body,
                }
            },
            onQueryStarted: async (arg, api) => {
                const currentUser = (api.getState() as RootState).auth.user

                //optimistic cache update
                const patchResult = api.dispatch(
                    messagesApi.util.updateQueryData(
                        'getMessages',
                        { conversationId: arg.conversationId } as any,
                        (draft) => {
                            draft.items.unshift({
                                ...(arg.data as any),
                                id: Date.now(),
                                image: arg.data.image
                                    ? ({ url: URL.createObjectURL(arg.data.image) } as Media)
                                    : undefined,
                                sender: currentUser,
                                isMeSender: true,
                            })
                        }
                    )
                )

                try {
                    await api.queryFulfilled
                } catch (err) {
                    patchResult.undo()
                    throw err
                }
            },
        }),

        sendReaction: build.mutation<
            Message,
            { messageId: string; conversationId: string; name: string }
        >({
            query: ({ conversationId, messageId, ...payload }) => ({
                url: `/conversations/${conversationId}/messages/${messageId}/reactions`,
                method: 'POST',
                body: payload,
            }),
        }),

        seenMessages: build.mutation<Message, string>({
            query: (conversationId) => ({
                url: `/conversations/${conversationId}/messages/seen`,
                method: 'POST',
            }),
        }),
    }),
})

export const {
    useGetMessagesQuery,
    useSendMessageMutation,
    useSendReactionMutation,
    useSeenMessagesMutation,
} = messagesApi
