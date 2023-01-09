"use client"
import React, { useEffect } from 'react'
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import { useGetNotificationsQuery, useUpdateAllNotificationMutation } from "@services/notificationsApi"
import AnimatePage from "@components/common/AnimatePage"
import SidebarLayout from "@components/common/SidebarLayout"
import InfiniteScroll from "react-infinite-scroll-component"
import { Notification } from "@interfaces/index.interfaces"
import useCurrentUser from "@hooks/useCurrentUser"
import NotificationItem from "./NotificationItem"
import Loading from "@components/common/Loading"

function Page(){
    const {}                                                             = useCurrentUser( { redirectTo: '/auth/login' } )
    const [UpdateAllNotification]                                        = useUpdateAllNotificationMutation()
    const { isLoading, items: notifications, loadMoreItem, hasMoreItem } = useGetInfiniteListQuery<Notification>(
        useGetNotificationsQuery, {
            page: 1,
            limit: 20
        },
        // @ts-ignore
        { refetchOnMountOrArgChange: true }
    )

    useEffect( () => {
        UpdateAllNotification()
    }, [] )

    const endMessage = notifications?.length > 0 ? 'No more notifications' : 'No notifications.'

    return (
        <AnimatePage>
            <SidebarLayout>
                <div className="box py-6 px-4 mb-6">
                    { ( ! notifications && isLoading ) ? <Loading size={ 20 }/> : null }

                    <InfiniteScroll
                        next={ loadMoreItem }
                        hasMore={ hasMoreItem }
                        loader={ <Loading size={ 20 }/> }
                        dataLength={ notifications?.length }
                        endMessage={ <p className="box text-center mt-5 py-10">{ endMessage }</p> }
                    >
                        { notifications.map( ( notification: Notification ) => (
                            <NotificationItem key={ notification.id } notification={ notification }/>
                        ) ) }
                    </InfiniteScroll>

                </div>
            </SidebarLayout>
        </AnimatePage>
    )
}

export default Page