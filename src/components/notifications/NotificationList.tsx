"use client"
import React from 'react'
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetNotificationsQuery } from "@services/notificationsApi"
import { Notification } from "@interfaces/index.interfaces"
import NotificationItem from "./NotificationItem"
import Loading from "@components/common/Loading"
import useInfiniteScroll from "react-infinite-scroll-hook"
import AnimatedComponent from "@components/common/AnimatedComponent"

export default function NotificationList(){
    const {
              isLoading,
              items: notifications,
              loadMoreItem,
              hasMoreItem
          } = useGetInfiniteListQuery<Notification>(
        useGetNotificationsQuery, {
            page: 1,
            limit: 10
        }
    )

    const [moreLoadRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: hasMoreItem,
        onLoadMore: loadMoreItem,
    } )

    return (
        <AnimatedComponent>
            <div>
                { isLoading ? <Loading size={ 40 }/> : null }
                { notifications && notifications.map( ( notification: Notification ) => (
                    <NotificationItem key={ notification.id } notification={ notification }/>
                ) ) }

                { hasMoreItem ? (
                    <div ref={ moreLoadRef }>
                        <Loading size={ 40 }/>
                    </div>
                ) : null }

                { ( ! isLoading && notifications?.length < 1 ) ? <p>No notifications</p> : null }
            </div>
        </AnimatedComponent>
    )
}