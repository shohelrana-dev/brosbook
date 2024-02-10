'use client'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import Error from '~/components/ui/Error'
import Transition from '~/components/ui/Transition'
import UserItem from '~/components/ui/UserItem'
import { User } from '~/interfaces/user.interfaces'
import { useGetFollowersQuery, useGetUserByUsernameQuery } from '~/services/usersApi'
import { getErrorData } from '~/utils/error'

interface Props {
	params: { username: string }
}

export default function FollowersPage({ params }: Props) {
	//hooks
	const [page, setPage] = useState(1)
	const { data: user } = useGetUserByUsernameQuery(params.username)
	const followersQuery = useGetFollowersQuery({ userId: user?.id!, page }, { skip: !user?.id })

	const { data: followersData, isLoading, isSuccess, isError, error } = followersQuery
	const { items: followers, nextPage } = followersData || {}
	const { message } = getErrorData(error) || {}

	//decide content
	let content = null
	if (isLoading) {
		content = <UsersSkeleton />
	} else if (isError) {
		content = <Error message={message} />
	} else if (isSuccess && followers && followers.length === 0) {
		content = <p className='text-center'>{user?.fullName}&apos;s haven&apos;t follower.</p>
	} else if (isSuccess && followers && followers.length > 0) {
		content = (
			<Transition>
				<InfiniteScroll
					next={() => setPage(nextPage!)}
					hasMore={!!nextPage}
					loader={<UsersSkeleton count={2} />}
					dataLength={followers.length}
				>
					{followers.map((user: User) => (
						<div className='mb-2' key={user.id}>
							<UserItem user={user} />
						</div>
					))}
				</InfiniteScroll>
			</Transition>
		)
	}

	return <div className='card p-3'>{content}</div>
}
