"use client"
import React from 'react'
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetNotificationsQuery } from "@services/notificationsApi"
import { Notification } from "@interfaces/index.interfaces"
import NotificationItem from "./NotificationItem"
import useInfiniteScroll from "react-infinite-scroll-hook"
import NotificationsSkeleton from "@components/skeletons/NotificationsSkeleton"

export default function NotificationList(){
    const {
              isLoading,
              items: notifications,
              loadMore,
              hasMore
          } = useGetInfiniteListQuery<Notification>(
        useGetNotificationsQuery, {
            page: 1,
            limit: 10
        }
    )

    const [moreLoadRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: hasMore,
        onLoadMore: loadMore,
    } )

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-900 ml-2 mb-1">Notifications</h3>
            { isLoading ? <NotificationsSkeleton/> : null }

            { notifications && notifications.map( ( notification: Notification ) => (
                <NotificationItem key={ notification.id } notification={ notification }/>
            ) ) }

            { hasMore ? (
                <div ref={ moreLoadRef }>
                    <NotificationsSkeleton count={ 3 }/>
                </div>
            ) : null }

            { ( ! isLoading && notifications?.length < 1 ) ? <p className="ml-2">No notifications</p> : null }
        </div>
    )
}