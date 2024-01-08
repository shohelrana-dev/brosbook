'use client'
import { postsApi, useGetPostsQuery } from '@/services/postsApi'
import PostsSkeleton from '@/components/skeletons/PostsSkeleton'
import { usersApi } from '@/services/usersApi'
import Error from '@/components/global/Error'
import { useEffect, useState } from 'react'
import { ErrorResponse, ListResponse } from '@/interfaces/index.interfaces'
import PostList from '@/components/post/PostList'
import { Post } from '@/interfaces/posts.interfaces'
import { store } from '@/store/index'
import { User } from '@/interfaces/user.interfaces'

interface Props {
	initialPostsData: ListResponse<Post>
	user: User
}

export default function UserPostsList({ initialPostsData, user }: Props) {
	//hooks
	const [page, setPage] = useState<number>(1)
	const postsQuery = useGetPostsQuery({ authorId: user?.id, page }, { skip: !user?.id || page === 1 })

	const { isLoading, isSuccess, isError, data: postsData = initialPostsData } = postsQuery || {}
	const { items: posts, nextPage } = postsData || {}
	const error = (postsQuery.error as ErrorResponse) || {}

	useEffect(() => {
		//store server rendered postsData
		if (initialPostsData && Object.keys(initialPostsData).length > 0) {
			store.dispatch(
				postsApi.util.upsertQueryData(
					'getPosts',
					{ page, authorId: user.id },
					{ ...initialPostsData }
				)
			)
		}

		//store server rendered userData
		if (user && user?.id) {
			store.dispatch(usersApi.util.upsertQueryData('getUserById', user.id, { ...user }))
		}
	}, [])

	//decide content
	let content = null
	if (isLoading) {
		content = <PostsSkeleton />
	} else if (isError) {
		content = <Error message={error.data?.message} />
	} else if (posts && posts?.length === 0) {
		content = <p className='box text-center py-6'>{user?.fullName}'s haven't any post.</p>
	} else if (posts && posts?.length > 0) {
		content = <PostList posts={posts} loadMore={() => setPage(nextPage!)} hasMore={!!nextPage} />
	}

	return <div className='mt-1'>{content}</div>
}
