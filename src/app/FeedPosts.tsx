'use client'
import { useEffect, useState } from 'react'
import { postsApi, useGetFeedPostsQuery } from '@services/postsApi'
import PostsSkeleton from '@components/skeletons/PostsSkeleton'
import Error from '@components/global/Error'
import PostList from '@components/post/PostList'
import { ErrorResponse, ListResponse } from '@interfaces/index.interfaces'
import { Post } from '@interfaces/posts.interfaces'
import { store } from '@store/index'

interface Props {
	initialPostsData: ListResponse<Post>
}

export default function FeedPosts({ initialPostsData }: Props) {
	//hooks
	const [page, setPage] = useState<number>(1)
	const feedPostsQuery = useGetFeedPostsQuery(page, { skip: page === 1 })

	const { isLoading, isSuccess, isError, data: postsData = initialPostsData } = feedPostsQuery || {}
	const { items: posts, nextPage } = postsData || {}
	const error = (feedPostsQuery.error as ErrorResponse) || {}

	useEffect(() => {
		if (initialPostsData && Object.keys(initialPostsData).length > 0) {
			store.dispatch(postsApi.util.upsertQueryData('getFeedPosts', page, { ...initialPostsData }))
		}
	}, [])

	//decide content
	let content = null
	if (isLoading) {
		content = <PostsSkeleton />
	} else if (isError) {
		content = <Error message={`Error fetching posts: ${error.data?.message}`} />
	} else if (posts && posts.length === 0) {
		content = <p className='box text-center py-6'>Your feed is empty.</p>
	} else if (posts && posts.length > 0) {
		content = <PostList posts={posts} loadMore={() => setPage(nextPage!)} hasMore={!!nextPage} />
	}

	return content
}
