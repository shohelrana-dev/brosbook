'use client'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import Error from '~/components/ui/Error'
import Transition from '~/components/ui/Transition'
import UserItem from '~/components/ui/UserItem'
import useAuth from '~/hooks/useAuth'
import { useGetSuggestedUsersQuery } from '~/services/usersApi'
import { extractErrorMessage } from '~/utils/error'

export default function SuggestionList() {
    //hooks
    const [page, setPage] = useState(1)
    const suggestedUsersQuery = useGetSuggestedUsersQuery({ page })
    const { isAuthenticated } = useAuth({ require: true })

    const { data: suggestedUsersData, isLoading, isSuccess, isError, error } = suggestedUsersQuery
    const { items: users, nextPage } = suggestedUsersData || {}

    if (!isAuthenticated) return null

    //decide content
    let content = null
    if (isLoading) {
        content = <UsersSkeleton />
    } else if (isError) {
        content = <Error message={extractErrorMessage(error)} />
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
                    {users.map((user) => (
                        <div className='pb-1' key={user.id}>
                            <UserItem user={user} />
                        </div>
                    ))}
                </InfiniteScroll>
            </Transition>
        )
    }

    return content
}
