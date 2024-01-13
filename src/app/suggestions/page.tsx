'use client'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Error from '~/components/global/Error'
import SidebarLayout from '~/components/global/SidebarLayout'
import Transition from '~/components/global/Transition'
import UserItem from '~/components/global/UserItem'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import useAuth from '~/hooks/useAuth'
import { ErrorResponse } from '~/interfaces/index.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { useGetSuggestedUsersQuery } from '~/services/usersApi'

export default function SuggestionsPage() {
	//hooks
	const [page, setPage] = useState(1)
	const suggestedUsersQuery = useGetSuggestedUsersQuery({ page })
	const { isAuthenticated } = useAuth({ require: true })

	const { data: suggestedUsersData, isLoading, isSuccess, isError } = suggestedUsersQuery || {}
	const { items: users = [], nextPage } = suggestedUsersData || {}
	const error = (suggestedUsersQuery.error as ErrorResponse) || {}

	useEffect(() => {
		document.title = 'Suggestions'
	}, [])

	if (!isAuthenticated) return null

	//decide content
	let content = null
	if (isLoading) {
		content = <UsersSkeleton />
	} else if (isSuccess && users.length === 0) {
		content = <p className='card text-center py-6'>You have no suggestion.</p>
	} else if (isError) {
		content = <Error message={error?.data?.message} />
	} else if (isSuccess && users.length > 0) {
		content = (
			<Transition>
				<InfiniteScroll
					dataLength={users.length}
					next={() => setPage(nextPage!)}
					hasMore={!!nextPage}
					loader={<UsersSkeleton />}
				>
					{users.map((user: User) => (
						<div className='pb-1' key={user.id}>
							<UserItem user={user} />
						</div>
					))}
				</InfiniteScroll>
			</Transition>
		)
	}

	return (
		<SidebarLayout>
			<div className='bg-white p-3 pt-4'>
				<h2 className='text-lg md:text-xl font-bold mb-4'>Suggested for you</h2>

				{content}
			</div>
		</SidebarLayout>
	)
}
