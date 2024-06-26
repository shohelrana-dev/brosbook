'use client'
import { useEffect, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import Error from '~/components/global/Error'
import Transition from '~/components/global/Transition'
import NotificationsSkeleton from '~/components/skeletons/NotificationsSkeleton'
import useSession from '~/hooks/useSession'
import { Notification } from '~/interfaces/index.interfaces'
import { extractErrorMessage } from '~/lib/error'
import { useGetNotificationsQuery, useReadAllNotificationMutation } from '~/services/notificationsApi'
import NotificationItem from './NotificationItem'

type Props = { skeletonCount?: number }

export default function NotificationList({ skeletonCount }: Props) {
    const [page, setPage] = useState(1)
    const notificationsQuery = useGetNotificationsQuery(page)
    const [readAllNotification] = useReadAllNotificationMutation()
    const { isLoggedIn } = useSession({ require: true })

    const { data: notificationsData, isLoading, isSuccess, isError, error } = notificationsQuery
    const { items: notifications, nextPage } = notificationsData || {}
    const firstNotification = notifications?.[0]

    useEffect(() => {
        if (firstNotification?.id && !firstNotification.readAt) {
            readAllNotification()
        }
    }, [firstNotification, readAllNotification])

    const [moreLoadRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: !!nextPage,
        onLoadMore: () => setPage(nextPage!),
    })

    if (!isLoggedIn) return null

    //decide content
    let content = null
    if (isLoading) {
        content = <NotificationsSkeleton count={skeletonCount} />
    } else if (isError) {
        content = <Error message={extractErrorMessage(error)} />
    } else if (isSuccess && notifications && notifications.length === 0) {
        content = <p className='ml-2'>No notifications</p>
    } else if (isSuccess && notifications && notifications.length > 0) {
        content = (
            <Transition>
                {notifications.map((notification: Notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))}
            </Transition>
        )
    }

    return (
        <>
            {content}

            {!!nextPage && (
                <div ref={moreLoadRef}>
                    <NotificationsSkeleton count={3} />
                </div>
            )}
        </>
    )
}
