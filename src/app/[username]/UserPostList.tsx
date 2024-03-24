'use client'
import { useRef, useState } from 'react'
import Error from '~/components/global/Error'
import PostList from '~/components/post/PostList'
import PostsSkeleton from '~/components/skeletons/PostsSkeleton'
import { ListResponse } from '~/interfaces/index.interfaces'
import { Post } from '~/interfaces/posts.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { postsApi, useGetPostsQuery } from '~/services/postsApi'
import { usersApi } from '~/services/usersApi'
import { store } from '~/store'
import { extractErrorMessage } from '~/utils/error'
import isServer from '~/utils/isServer'

interface Props {
    initialPostsData?: ListResponse<Post>
    user: User
}

export default function UserPostsList({ initialPostsData, user }: Props) {
    //hooks
    const [page, setPage] = useState<number>(1)
    const postsQuery = useGetPostsQuery({ authorId: user?.id, page })
    const loadedRef = useRef(false)

    const { isLoading, isSuccess, isError, data = initialPostsData, error } = postsQuery
    const { items: posts, nextPage } = data || {}

    //prevent data fetch in client side if data already fetch in server side
    if (initialPostsData?.currentPage && !isServer && !loadedRef.current) {
        store.dispatch(
            postsApi.util.upsertQueryData('getPosts', { authorId: user?.id } as any, {
                ...initialPostsData,
            })
        )
        store.dispatch(usersApi.util.upsertQueryData('getUserById', user.id, { ...user }))
        loadedRef.current = true
    }

    //decide content
    let content = null
    if (isLoading) {
        content = <PostsSkeleton />
    } else if (isError) {
        content = <Error message={extractErrorMessage(error)} />
    } else if (isSuccess && posts && posts?.length === 0) {
        content = <p className='card text-center py-6'>{user?.fullName}&apos;s haven&apos;t any post.</p>
    }

    //extra condtion for server rendering
    if (posts && posts.length > 0) {
        content = <PostList posts={posts} loadMore={() => setPage(nextPage!)} hasMore={!!nextPage} />
    }

    return <div className='mt-1'>{content}</div>
}
