"use client"
import React, { useState } from 'react'
import { useGetNotificationsQuery } from "@services/notificationsApi"
import { ErrorResponse, Notification } from "@interfaces/index.interfaces"
import NotificationItem from "./NotificationItem"
import useInfiniteScroll from "react-infinite-scroll-hook"
import NotificationsSkeleton from "@components/skeletons/NotificationsSkeleton"
import Error from "@components/global/Error"

export default function NotificationList(){
    const [page, setPage]    = useState( 1 )
    const notificationsQuery = useGetNotificationsQuery( page )

    const { data: notificationsData, isLoading, isSuccess, isError } = notificationsQuery || {}
    const { items: notifications = [], nextPage }                    = notificationsData || {}
    const error                                                      = notificationsQuery.error as ErrorResponse || {}

    const [moreLoadRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! nextPage,
        onLoadMore: () => setPage( nextPage! ),
    } )

    //decide content
    let content = null
    if( isLoading ){
        content = <NotificationsSkeleton/>
    } else if( isSuccess && notifications.length === 0 ){
        content = <p className="ml-2">No notifications</p>
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && notifications.length > 0 ){
        content = notifications.map( ( notification: Notification ) => (
            <NotificationItem key={ notification.id } notification={ notification }/>
        ) )
    }

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-900 ml-2 mb-1">Notifications</h3>
            { content }

            { !! nextPage ? (
                <div ref={ moreLoadRef }>
                    <NotificationsSkeleton count={ 3 }/>
                </div>
            ) : null }
        </div>
    )
}