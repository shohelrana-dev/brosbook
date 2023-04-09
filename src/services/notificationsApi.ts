import { baseApi } from "./baseApi"
import { ListResponse, Notification } from "@interfaces/index.interfaces"

const notificationsPerPage = process.env.NEXT_PUBLIC_NOTIFICATIONS_PER_PAGE

export const notificationsApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getNotifications: build.query<ListResponse<Notification>, number>( {
            query: ( page ) => ( {
                url: `/notifications`,
                params: { page, limit: notificationsPerPage }
            } ),
            providesTags: ['Notifications']
        } ),

        getUnreadNotificationsCount: build.query<{ count: number }, void>( {
            query: () => ( {
                url: `/notifications/unread_count`
            } ),
            providesTags: ['Notifications']
        } ),

        readAllNotification: build.mutation<Notification[], void>( {
            query: () => ( {
                url: `/notifications/read_all`,
                method: 'PUT'
            } ),
            invalidatesTags: ['Notifications']
        } ),

    } ),
} )

export const {
                 useGetNotificationsQuery,
                 useGetUnreadNotificationsCountQuery,
                 useReadAllNotificationMutation
             } = notificationsApi