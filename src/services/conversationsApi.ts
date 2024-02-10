import { Conversation, Message } from '~/interfaces/conversation.interfaces'
import { ListResponse, Media } from '~/interfaces/index.interfaces'
import { RootState } from '~/store/index'
import { CONVERSATIONS_PER_PAGE, MEDIA_PER_PAGE } from '~/utils/constants'
import listQueryExtraDefinitions from '~/utils/listQueryExtraDefinitions'
import { baseApi } from './baseApi'

export const conversationsApi = baseApi.injectEndpoints({
	endpoints: build => ({
		getConversations: build.query<ListResponse<Conversation>, number>({
			query: page => ({
				url: `/conversations`,
				params: { page, limit: CONVERSATIONS_PER_PAGE },
			}),
			providesTags: [{ type: 'Conversation', id: 'LIST' }],
			...listQueryExtraDefinitions,
			onCacheEntryAdded: async (arg, api) => {
				const { updateCachedData, cacheEntryRemoved, cacheDataLoaded, getState } = api
				const rootState = getState() as RootState
				const currentUser = rootState.auth.user
				const socket = rootState.socket.socket

				try {
					await cacheDataLoaded

					//update conversation last message on conversations
					const newMessageListener = (data: Message) => {
						const message = { ...data }
						message.isMeSender = message.sender.id === currentUser?.id

						updateCachedData(draft => {
							const conversation = draft.items.find(c => c.id === message.conversation?.id)

							if (conversation?.id) {
								//update last message
								conversation.lastMessage = message
								if (!message.isMeSender) {
									conversation.unreadMessagesCount += 1
								}

								//bring the conversation at top
								const index = draft.items.indexOf(conversation)
								if (index > 0) {
									draft.items.splice(index, 1)
									draft.items.unshift(conversation)
								}
							} else if (message.conversation) {
								message.conversation.lastMessage = message
								draft.items.unshift(message.conversation)
							}
						})
					}

					//update conversation last message on conversations
					const seenMessageListener = (data: Message) => {
						const message = { ...data }
						message.isMeSender = message.sender.id === currentUser?.id

						updateCachedData(draft => {
							const conversation = draft.items.find(c => c.id === message.conversation?.id)

							if (conversation?.id) {
								conversation.lastMessage = message
								conversation.unreadMessagesCount = 0
							}
						})
					}

					socket?.on(`message.new`, newMessageListener)
					socket?.on(`message.seen`, seenMessageListener)
				} catch (err) {
					await cacheEntryRemoved
					throw err
				}
			},
		}),

		getConversationById: build.query<Conversation, string>({
			query: conversationId => ({
				url: `/conversations/${conversationId}`,
			}),
		}),

		getConversationByParticipantId: build.query<Conversation, string>({
			query: participantId => ({
				url: `/conversations/by/participant_id/${participantId}`,
			}),
		}),

		getUnreadConversationsCount: build.query<{ count: number }, void>({
			query: () => `/conversations/unread_count`,
			onCacheEntryAdded: async (arg, api) => {
				const { cacheDataLoaded, cacheEntryRemoved, updateCachedData, getState } = api
				const rootState = getState() as RootState
				const currentUser = rootState.auth.user
				const socket = rootState.socket.socket

				try {
					await cacheDataLoaded

					socket?.on(`conversation.unread.count.${currentUser?.id}`, (count: number) => {
						updateCachedData(draft => {
							draft.count = count
						})
					})
				} catch (err) {
					await cacheEntryRemoved
					throw err
				}
			},
		}),

		createConversation: build.mutation<Conversation, string>({
			query: participantId => ({
				url: `/conversations`,
				method: 'POST',
				body: { participantId },
			}),
			onQueryStarted: async (arg, api) => {
				try {
					const { data } = await api.queryFulfilled

					//@ts-ignore
					api.dispatch(
						conversationsApi.util.updateQueryData(
							'getConversations',
							undefined as any,
							(draft: ListResponse<Conversation>) => {
								draft.items.unshift(data)
							}
						)
					)
				} catch (err) {
					throw err
				}
			},
		}),

		getConversationMediaList: build.query<
			ListResponse<Media>,
			{ conversationId: string; page: number }
		>({
			query: ({ conversationId, page }) => ({
				url: `/conversations/${conversationId}/media`,
				params: { page, limit: MEDIA_PER_PAGE },
			}),
			providesTags: ['ConversationMedia'],
			...listQueryExtraDefinitions,
		}),
	}),
})

export const {
	useGetConversationsQuery,
	useCreateConversationMutation,
	useGetConversationByParticipantIdQuery,
	useLazyGetConversationByParticipantIdQuery,
	useGetConversationByIdQuery,
	useGetUnreadConversationsCountQuery,
	useGetConversationMediaListQuery,
} = conversationsApi
