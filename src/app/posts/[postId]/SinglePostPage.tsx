'use client'
import { useParams } from 'next/navigation'
import { useRef } from 'react'
import PostCard from '~/components/post/PostCard'
import { Post } from '~/interfaces/posts.interfaces'
import { postsApi, useGetPostByIdQuery } from '~/services/postsApi'
import { store } from '~/store'
import isServer from '~/utils/isServer'

export default function SinglePostPage({ initialPost }: { initialPost?: Post }) {
	const { postId } = useParams<{ postId: string }>()
	const { data = initialPost } = useGetPostByIdQuery(initialPost?.id || postId)
	const loaded = useRef(false)

	//prevent data fetch in client side if data already fetch in server side
	if (initialPost?.id && !isServer && !loaded.current) {
		store.dispatch(
			postsApi.util.upsertQueryData('getPostById', initialPost.id || postId, { ...initialPost })
		)

		loaded.current = true
	}

	return <PostCard post={data!} initialCommentsVisible={true} />
}
