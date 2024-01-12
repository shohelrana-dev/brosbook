'use client'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Error from '~/components/global/Error'
import UserItem from '~/components/global/UserItem'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import { ErrorResponse } from '~/interfaces/index.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { useGetFollowersQuery, useGetUserByUsernameQuery } from '~/services/usersApi'

interface Props {
	params: { username: string }
}

export default function FollowersPage({ params }: Props) {
	//hooks
	const [page, setPage] = useState(1)
	const { data: user } = useGetUserByUsernameQuery(params.username)
	const followersQuery = useGetFollowersQuery({ userId: user?.id!, page }, { skip: !user?.id })

	const { data: followersData, isLoading, isSuccess, isError } = followersQuery || {}
	const { items: followers = [], nextPage } = followersData || {}
	const error = (followersQuery.error as ErrorResponse) || {}

	//decide content
	let content = null
	if (isLoading) {
		content = <UsersSkeleton />
	} else if (isSuccess && followers.length === 0) {
		content = <p className='text-center'>{user?.fullName}&apos;s haven&apos;t follower.</p>
	} else if (isError) {
		content = <Error message={error.data?.message} />
	} else if (isSuccess && followers.length > 0) {
		content = (
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
		)
	}

	return <div className='card p-3'>{content}</div>
}
