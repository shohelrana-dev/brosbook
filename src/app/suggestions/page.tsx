'use client'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import Error from '~/components/ui/Error'
import SidebarLayout from '~/components/ui/SidebarLayout'
import Transition from '~/components/ui/Transition'
import UserItem from '~/components/ui/UserItem'
import useAuth from '~/hooks/useAuth'
import { User } from '~/interfaces/user.interfaces'
import { useGetSuggestedUsersQuery } from '~/services/usersApi'
import { getErrorData } from '~/utils/error'

export default function SuggestionsPage() {
	//hooks
	const [page, setPage] = useState(1)
	const suggestedUsersQuery = useGetSuggestedUsersQuery({ page })
	const { isAuthenticated } = useAuth({ require: true })

	const { data: suggestedUsersData, isLoading, isSuccess, isError, error } = suggestedUsersQuery
	const { items: users, nextPage } = suggestedUsersData || {}
	const { message } = getErrorData(error) || {}

	useEffect(() => {
		document.title = 'Suggestions'
	}, [])

	if (!isAuthenticated) return null

	//decide content
	let content = null
	if (isLoading) {
		content = <UsersSkeleton />
	} else if (isError) {
		content = <Error message={message} />
	} else if (isSuccess && users && users.length === 0) {
		content = <p className='card text-center py-6'>You have no suggestion.</p>
	} else if (isSuccess && users && users.length > 0) {
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
