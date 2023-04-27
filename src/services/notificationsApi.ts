import { baseApi } from "./baseApi"
import { ListResponse, Notification } from "@interfaces/index.interfaces"
import { RootState } from "@store/index"
import { io } from "socket.io-client"
import listQueryExtraDefinitions from "@utils/listQueryExtraDefinitions"

const notificationsPerPage = process.env.NEXT_PUBLIC_NOTIFICATIONS_PER_PAGE
const socket               = io( process.env.NEXT_PUBLIC_SERVER_BASE_URL! )

export const notificationsApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getNotifications: build.query<ListResponse<Notification>, number>( {
            query: ( page ) => ( {
                url: `/notifications`,
                params: { page, limit: notificationsPerPage }
            } ),
            onCacheEntryAdded: async( arg, api ) => {
                const { cacheDataLoaded, cacheEntryRemoved, updateCachedData, getState } = api
                const rootState                                                          = getState() as RootState
                const currentUser                                                        = rootState?.auth?.user

                try {
                    await cacheDataLoaded

                    socket.on( `notification.new.${ currentUser?.id }`, ( notification ) => {
                        updateCachedData( ( draft ) => {
                            draft.items.unshift( notification )
                        } )
                    } )

                } catch ( err ) {
                    await cacheEntryRemoved
                    socket.close()
                    throw err
                }
            },
            ...listQueryExtraDefinitions
        } ),

        getUnreadNotificationsCount: build.query<{ count: number }, void>( {
            query: () => ( {
                url: `/notifications/unread_count`
            } ),
            onCacheEntryAdded: async( arg, api ) => {
                const { cacheDataLoaded, cacheEntryRemoved, updateCachedData, getState } = api
                const rootState                                                          = getState() as RootState
                const currentUser                                                        = rootState?.auth?.user

                try {
                    await cacheDataLoaded

                    socket.on( `notification.unread.count.${ currentUser?.id }`, ( count: number ) => {
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

        readAllNotification: build.mutation<Notification[], void>( {
            query: () => ( {
                url: `/notifications/read_all`,
                method: 'PUT'
            } )
        } ),

    } ),
} )

export const {
                 useGetNotificationsQuery,
                 useGetUnreadNotificationsCountQuery,
                 useReadAllNotificationMutation
             } = notificationsApi