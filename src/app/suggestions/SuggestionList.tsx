'use client'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Error from '~/components/global/Error'
import Transition from '~/components/global/Transition'
import UserItem from '~/components/global/UserItem'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import useSession from '~/hooks/useSession'
import { extractErrorMessage } from '~/lib/error'
import { useGetSuggestedUsersQuery } from '~/services/usersApi'

export default function SuggestionList() {
    //hooks
    const [page, setPage] = useState(1)
    const suggestedUsersQuery = useGetSuggestedUsersQuery({ page })
    const { isLoggedIn } = useSession({ require: true })

    const { data: suggestedUsersData, isLoading, isSuccess, isError, error } = suggestedUsersQuery
    const { items: users, nextPage } = suggestedUsersData || {}

    if (!isLoggedIn) return null

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
