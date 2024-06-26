'use client'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Error from '~/components/global/Error'
import Transition from '~/components/global/Transition'
import UserItem from '~/components/global/UserItem'
import UsersSkeleton from '~/components/skeletons/UsersSkeleton'
import { User } from '~/interfaces/user.interfaces'
import { extractErrorMessage } from '~/lib/error'
import { useGetFollowingsQuery, useGetUserByUsernameQuery } from '~/services/usersApi'

interface Props {
    params: { username: string }
}

export default function FollowingPage({ params }: Props) {
    //hooks
    const [page, setPage] = useState(1)
    const { data: user } = useGetUserByUsernameQuery(params.username)
    const followingsQuery = useGetFollowingsQuery({ userId: user?.id!, page }, { skip: !user?.id })

    const { data, isLoading, isSuccess, isError, error, isUninitialized } = followingsQuery
    const { items: followings, nextPage } = data || {}

    //decide content
    let content = null
    if (isLoading || isUninitialized) {
        content = <UsersSkeleton />
    } else if (isSuccess && followings && followings.length === 0) {
        content = <p className='text-center'>{user?.fullName}&apos;s haven&apos;t following.</p>
    } else if (isError) {
        content = <Error message={extractErrorMessage(error)} />
    } else if (isSuccess && followings && followings.length > 0) {
        content = (
            <Transition>
                <InfiniteScroll
                    next={() => setPage(nextPage!)}
                    hasMore={!!nextPage}
                    loader={<UsersSkeleton count={2} />}
                    dataLength={followings.length}
                >
                    {followings.map((user: User) => (
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
