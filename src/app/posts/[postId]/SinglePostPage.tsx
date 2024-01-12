'use client'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import PostCard from '~/components/post/PostCard'
import { Post } from '~/interfaces/posts.interfaces'
import { postsApi, useGetPostByIdQuery } from '~/services/postsApi'
import { store } from '~/store/index'

export default function SinglePostPage({ post: initialPost }: { post: Post }) {
	const { postId } = useParams<{ postId: string }>()
	const { data: post = initialPost } = useGetPostByIdQuery(initialPost.id || postId, {
		skip: initialPost.id ? true : false,
	})

	useEffect(() => {
		store.dispatch(postsApi.util.upsertQueryData('getPostById', initialPost.id, { ...initialPost }))
	}, [])

	return <PostCard post={post!} initialCommentsVisible={true} />
}
