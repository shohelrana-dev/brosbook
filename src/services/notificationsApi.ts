import { ListResponse, Notification } from '~/interfaces/index.interfaces'
import { RootState } from '~/store'
import { NOTIFICATIONS_PER_PAGE } from '~/utils/constants'
import listQueryExtraDefinitions from '~/utils/listQueryExtraDefinitions'
import { baseApi } from './baseApi'

export const notificationsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getNotifications: build.query<ListResponse<Notification>, number>({
            query: (page) => ({
                url: `/notifications`,
                params: { page, limit: NOTIFICATIONS_PER_PAGE },
            }),
            onCacheEntryAdded: async (arg, api) => {
                const { cacheDataLoaded, cacheEntryRemoved, updateCachedData, getState } = api
                const rootState = getState() as RootState
                const currentUser = rootState.session.user
                const socket = rootState.socket.socket

                try {
                    await cacheDataLoaded

                    socket?.on(`notification.new.${currentUser?.id}`, (notification) => {
                        updateCachedData((draft) => {
                            draft.items.unshift(notification)
                        })
                    })
                } catch (err) {
                    await cacheEntryRemoved
                    throw err
                }
            },
            ...listQueryExtraDefinitions,
        }),

        getUnreadNotificationsCount: build.query<{ count: number }, void>({
            query: () => ({
                url: `/notifications/unread_count`,
            }),
            onCacheEntryAdded: async (arg, api) => {
                const { cacheDataLoaded, cacheEntryRemoved, updateCachedData, getState } = api
                const rootState = getState() as RootState
                const currentUser = rootState.session.user
                const socket = rootState.socket.socket

                try {
                    await cacheDataLoaded

                    socket?.on(`notification.unread.count.${currentUser?.id}`, (count: number) => {
                        updateCachedData((draft) => {
                            draft.count = count
                        })
                    })
                } catch (err) {
                    await cacheEntryRemoved
                    throw err
                }
            },
        }),

        readAllNotification: build.mutation<Notification[], void>({
            query: () => ({
                url: `/notifications/read_all`,
                method: 'PATCH',
            }),
        }),
    }),
})

export const {
    useGetNotificationsQuery,
    useGetUnreadNotificationsCountQuery,
    useReadAllNotificationMutation,
} = notificationsApi
