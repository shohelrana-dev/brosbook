import { baseApi } from "./baseApi"
import { ListQueryParams, ListResponse, Notification } from "@interfaces/index.interfaces"

export const notificationsApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getNotifications: build.query<ListResponse<Notification>, ListQueryParams>( {
            query: ( params ) => ( {
                url: `/notifications`,
                params
            } )
        } ),

        getUnreadNotificationsCount: build.query<{ count: number }, void>( {
            query: () => ( {
                url: `/notifications/unread_count`
            } )
        } ),

        updateNotification: build.mutation<Notification, string>( {
            query: ( notificationId ) => ( {
                url: `/notifications/${ notificationId }`,
                method: 'PUT'
            } )
        } ),

        updateAllNotification: build.mutation<Notification[], void>( {
            query: () => ( {
                url: `/notifications`,
                method: 'PUT'
            } )
        } ),

    } ),
} )

export const {
                 useGetNotificationsQuery,
                 useGetUnreadNotificationsCountQuery,
                 useUpdateNotificationMutation,
                 useUpdateAllNotificationMutation
             } = notificationsApi