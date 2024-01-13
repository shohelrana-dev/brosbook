'use client'
import { Button } from '@mui/material'
import Link from 'next/link'
import Error from '~/components/global/Error'
import UserItem from '~/components/global/UserItem'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import WidgetLayout from '~/components/widgets/WidgetLayout'
import useAuth from '~/hooks/useAuth'
import { ErrorResponse } from '~/interfaces/index.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { useGetSuggestedUsersQuery } from '~/services/usersApi'

export default function SuggestedPeople() {
	const { isAuthenticated } = useAuth()
	const suggestedUsersQuery = useGetSuggestedUsersQuery({ page: 1, limit: 6 })

	const { isError, isLoading } = suggestedUsersQuery
	const { items: users, nextPage } = suggestedUsersQuery?.data || {}
	const error = (suggestedUsersQuery.error || {}) as ErrorResponse

	if (!isAuthenticated) return null

	//decide content
	let content = null
	if (isLoading) {
		content = <UsersSkeleton count={2} />
	} else if (isError) {
		content = <Error message={error?.data?.message} />
	} else if (users && users.length === 0) {
		content = <p>No suggestions</p>
	} else if (users && users.length > 0) {
		content = users.map((user: User) => <UserItem user={user} key={user.id} />)
	}

	return (
		<WidgetLayout title='Suggestions for you'>
			{content}

			{!!nextPage ? (
				<Link href='/suggestions'>
					<Button>See More</Button>
				</Link>
			) : null}
		</WidgetLayout>
	)
}
