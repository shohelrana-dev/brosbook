"use client"
import React from 'react'
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetNotificationsQuery } from "@services/notificationsApi"
import AnimatedComponent from "@components/common/AnimatedComponent"
import InfiniteScroll from "react-infinite-scroller"
import { Notification } from "@interfaces/index.interfaces"
import NotificationItem from "./NotificationItem"
import Loading from "@components/common/Loading"

export default function NotificationList(){
    const {
              isLoading,
              isFetching,
              items: notifications,
              loadMoreItem,
              hasMoreItem
          } = useGetInfiniteListQuery<Notification>(
        useGetNotificationsQuery, {
            page: 1,
            limit: 10
        }
    )

    const endMessage = ( ! isLoading && ! isFetching && notifications?.length < 1 ) ? 'No notifications' : null

    return (
        <div>
            { isLoading ? <Loading size={ 40 }/> : null }

            <AnimatedComponent>
                <InfiniteScroll
                    loadMore={ loadMoreItem }
                    hasMore={ hasMoreItem }
                    loader={ <Loading size={ 40 }/> }
                >
                    { notifications.map( ( notification: Notification ) => (
                        <NotificationItem key={ notification.id } notification={ notification }/>
                    ) ) }
                </InfiniteScroll>
            </AnimatedComponent>
        </div>
    )
}