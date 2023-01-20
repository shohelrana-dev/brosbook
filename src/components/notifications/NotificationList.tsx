"use client"
import React from 'react'
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetNotificationsQuery } from "@services/notificationsApi"
import AnimatePage from "@components/common/AnimatePage"
import InfiniteScroll from "react-infinite-scroll-component"
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
            limit: 20
        }
    )

    const endMessage = ! isLoading && ! isFetching && notifications?.length > 0 ? 'No notifications' : null

    return (
        <AnimatePage>
            <div>
                { ( ! notifications && isLoading ) ? <Loading size={ 40 }/> : null }

                <InfiniteScroll
                    next={ loadMoreItem }
                    hasMore={ hasMoreItem }
                    loader={ <Loading size={ 40 }/> }
                    dataLength={ notifications?.length }
                    endMessage={ <p className="box text-center mt-5 py-10">{ endMessage }</p> }
                >
                    { notifications.map( ( notification: Notification ) => (
                        <NotificationItem key={ notification.id } notification={ notification }/>
                    ) ) }
                </InfiniteScroll>
            </div>
        </AnimatePage>
    )
}