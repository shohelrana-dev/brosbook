'use client'
import React from 'react'
import { User } from '@/interfaces/user.interfaces'
import { useGetFollowersQuery } from '@/services/usersApi'
import UserItem from '@/components/global/UserItem'
import Link from 'next/link'
import UsersSkeleton from '@/components/skeletons/UsersSkeleton'
import useAuthState from '@/hooks/useAuthState'
import Error from '@/components/global/Error'
import { ErrorResponse } from '@/interfaces/index.interfaces'
import { Button } from '@mui/material'
import WidgetLayout from '@/components/widgets/WidgetLayout'

export default function Followers() {
	const { isAuthenticated, user } = useAuthState()
	const followersQuery = useGetFollowersQuery({ userId: user?.id!, page: 1 }, { skip: !user?.id })

	const { isError, isLoading } = followersQuery
	const { items: users, nextPage } = followersQuery?.data || {}
	const error = (followersQuery.error || {}) as ErrorResponse

	if (!isAuthenticated) return null

	//decide content
	let content = null
	if (isLoading) {
		content = <UsersSkeleton count={2} />
	} else if (isError) {
		content = <Error message={error?.data?.message} />
	} else if (users && users.length === 0) {
		content = <p>No one following yet.</p>
	} else if (users && users.length > 0) {
		content = users.map((user: User) => <UserItem user={user} key={user.id} />)
	}

	return (
		<WidgetLayout title="Who's follownig">
			{content}

			{!!nextPage ? (
				<Link href={`/${user?.username}/followers`}>
					<Button>See More</Button>
				</Link>
			) : null}
		</WidgetLayout>
	)
}
