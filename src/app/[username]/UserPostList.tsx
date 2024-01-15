'use client'
import { useRef, useState } from 'react'
import Error from '~/components/global/Error'
import PostList from '~/components/post/PostList'
import PostsSkeleton from '~/components/skeletons/PostsSkeleton'
import { ErrorResponse, ListResponse } from '~/interfaces/index.interfaces'
import { Post } from '~/interfaces/posts.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { postsApi, useGetPostsQuery } from '~/services/postsApi'
import { usersApi } from '~/services/usersApi'
import { store } from '~/store'
import isServer from '~/utils/isServer'

interface Props {
	initialPostsData?: ListResponse<Post>
	user: User
}

export default function UserPostsList({ initialPostsData, user }: Props) {
	//hooks
	const [page, setPage] = useState<number>(1)
	const postsQuery = useGetPostsQuery({ authorId: user?.id, page })
	const loaded = useRef(false)

	const { isLoading, isError, data = initialPostsData } = postsQuery || {}
	const { items: posts, nextPage } = data || {}
	const error = (postsQuery.error as ErrorResponse) || {}

	//prevent data fetch in client side if data already fetch in server side
	if (initialPostsData?.currentPage && !isServer && !loaded.current) {
		store.dispatch(
			postsApi.util.upsertQueryData('getPosts', { authorId: user?.id } as any, {
				...initialPostsData,
			})
		)
		store.dispatch(usersApi.util.upsertQueryData('getUserById', user.id, { ...user }))
		loaded.current = true
	}

	//decide content
	let content = null
	if (isLoading) {
		content = <PostsSkeleton />
	} else if (isError) {
		content = <Error message={error.data?.message} />
	} else if (posts && posts?.length === 0) {
		content = <p className='card text-center py-6'>{user?.fullName}&apos;s haven&apos;t any post.</p>
	}

	//extra condtion for server rendering
	if (posts && posts.length > 0) {
		content = <PostList posts={posts} loadMore={() => setPage(nextPage!)} hasMore={!!nextPage} />
	}

	return <div className='mt-1'>{content}</div>
}
