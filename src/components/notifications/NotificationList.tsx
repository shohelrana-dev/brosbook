'use client'
import { useEffect, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import Error from '~/components/global/Error'
import Transition from '~/components/global/Transition'
import NotificationsSkeleton from '~/components/skeletons/NotificationsSkeleton'
import useAuth from '~/hooks/useAuth'
import { ErrorResponse, Notification } from '~/interfaces/index.interfaces'
import { useGetNotificationsQuery, useReadAllNotificationMutation } from '~/services/notificationsApi'
import NotificationItem from './NotificationItem'

interface Props {
	skeletonCount?: number
}

export default function NotificationList({ skeletonCount }: Props) {
	const [page, setPage] = useState(1)
	const notificationsQuery = useGetNotificationsQuery(page)
	const [readAllNotification] = useReadAllNotificationMutation()
	const { isAuthenticated } = useAuth({ require: true })

	const { data: notificationsData, isLoading, isSuccess, isError } = notificationsQuery || {}
	const { items: notifications = [], nextPage } = notificationsData || {}
	const error = (notificationsQuery.error as ErrorResponse) || {}
	const firstNotification = notifications[0] || {}

	useEffect(() => {
		if (isSuccess && firstNotification.id && !firstNotification.readAt) {
			readAllNotification()
		}
	}, [isSuccess, firstNotification])

	const [moreLoadRef] = useInfiniteScroll({
		loading: isLoading,
		hasNextPage: !!nextPage,
		onLoadMore: () => setPage(nextPage!),
	})

	if (!isAuthenticated) return null

	//decide content
	let content = null
	if (isLoading) {
		content = <NotificationsSkeleton count={skeletonCount} />
	} else if (isSuccess && notifications.length === 0) {
		content = <p className='ml-2'>No notifications</p>
	} else if (isError) {
		content = <Error message={error?.data?.message} />
	} else if (isSuccess && notifications.length > 0) {
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

			{nextPage ? (
				<div ref={moreLoadRef}>
					<NotificationsSkeleton count={3} />
				</div>
			) : null}
		</>
	)
}
