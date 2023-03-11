"use client"
import React from 'react'
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetNotificationsQuery } from "@services/notificationsApi"
import { Notification } from "@interfaces/index.interfaces"
import NotificationItem from "./NotificationItem"
import useInfiniteScroll from "react-infinite-scroll-hook"
import NotificationsSkeleton from "@components/skeletons/NotificationsSkeleton"
import Error from "@components/global/Error"

export default function NotificationList(){
    const {
              isLoading,
              isSuccess,
              isError,
              items: notifications,
              error,
              loadMore,
              hasMore
          } = useGetInfiniteListQuery<Notification>(
        useGetNotificationsQuery, { page: 1, limit: 10 }
    )

    const [moreLoadRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: hasMore,
        onLoadMore: loadMore,
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

            { hasMore ? (
                <div ref={ moreLoadRef }>
                    <NotificationsSkeleton count={ 3 }/>
                </div>
            ) : null }
        </div>
    )
}