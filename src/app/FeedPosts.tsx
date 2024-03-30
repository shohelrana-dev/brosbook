'use client'
import { useRef, useState } from 'react'
import Error from '~/components/global/Error'
import PostList from '~/components/post/PostList'
import PostsSkeleton from '~/components/skeletons/PostsSkeleton'
import { ErrorResponse, ListResponse } from '~/interfaces/index.interfaces'
import { Post } from '~/interfaces/posts.interfaces'
import { store } from '~/lib/store'
import { isServer } from '~/lib/utils'
import { postsApi, useGetFeedPostsQuery } from '~/services/postsApi'

interface Props {
    initialPostsData?: ListResponse<Post>
}

export default function FeedPosts({ initialPostsData }: Props) {
    //hooks
    const [page, setPage] = useState<number>(1)
    const feedPostsQuery = useGetFeedPostsQuery(page)
    const loadedRef = useRef(false)

    const { isLoading, isSuccess, isError, data = initialPostsData } = feedPostsQuery
    const { items: posts, nextPage } = data || {}
    const error = (feedPostsQuery.error as ErrorResponse) || {}

    //prevent data fetch in client side if data already fetch in server side
    if (initialPostsData?.currentPage && !isServer && !loadedRef.current) {
        store.dispatch(postsApi.util.upsertQueryData('getFeedPosts', page, { ...initialPostsData }))
        loadedRef.current = true
    }

    //decide content
    let content = null
    if (isLoading) {
        content = <PostsSkeleton />
    } else if (isError) {
        content = <Error message={`Error fetching posts: ${error.data?.message}`} />
    } else if (isSuccess && posts && posts.length === 0) {
        content = <p className='card text-center py-6'>Your feed is empty.</p>
    }

    //extra condtion for server rendering
    if (posts && posts.length > 0) {
        content = <PostList posts={posts} loadMore={() => setPage(nextPage!)} hasMore={!!nextPage} />
    }

    return content
}
