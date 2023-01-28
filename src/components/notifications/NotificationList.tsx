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
              items: notifications,
              loadMoreItem,
              hasMoreItem
          } = useGetInfiniteListQuery<Notification>(
        useGetNotificationsQuery, {
            page: 1,
            limit: 10
        }
    )

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

                { ( ! isLoading && notifications?.length < 1 ) ? <p>No notifications</p> : null }
            </AnimatedComponent>
        </div>
    )
}