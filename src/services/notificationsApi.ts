import { baseApi } from "./baseApi"
import { ListQueryParams, ListResponse, Notification } from "@interfaces/index.interfaces"

export const notificationsApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getNotifications: build.query<ListResponse<Notification>, ListQueryParams>( {
            query: ( params ) => ( {
                url: `/notifications`,
                params
            } ),
            providesTags: ['Notification'],
            keepUnusedDataFor: 0.0001
        } ),

        getUnreadNotificationsCount: build.query<{ count: number }, void>( {
            query: () => ( {
                url: `/notifications/unread_count`
            } ),
            providesTags: ['Notification'],
            keepUnusedDataFor: 0.0001
        } ),

        updateNotification: build.mutation<Notification, string>( {
            query: ( notificationId ) => ( {
                url: `/notifications/${ notificationId }`,
                method: 'PUT'
            } ),
            invalidatesTags: ['Notification']
        } ),

        updateAllNotification: build.mutation<Notification[], void>( {
            query: () => ( {
                url: `/notifications`,
                method: 'PUT'
            } ),
            invalidatesTags: ['Notification']
        } ),

    } ),
} )

export const {
                 useGetNotificationsQuery,
                 useGetUnreadNotificationsCountQuery,
                 useUpdateNotificationMutation,
                 useUpdateAllNotificationMutation
             } = notificationsApi