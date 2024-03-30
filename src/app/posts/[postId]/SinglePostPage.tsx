'use client'
import { useParams } from 'next/navigation'
import { useRef } from 'react'
import PostCard from '~/components/post/PostCard'
import { Post } from '~/interfaces/posts.interfaces'
import { store } from '~/lib/store'
import { isServer } from '~/lib/utils'
import { postsApi, useGetPostByIdQuery } from '~/services/postsApi'

export default function SinglePostPage({ initialPost }: { initialPost?: Post }) {
    const { postId } = useParams<{ postId: string }>()
    const { data = initialPost } = useGetPostByIdQuery(initialPost?.id || postId)
    const loadedRef = useRef(false)

    //prevent data fetch in client side if data already fetch in server side
    if (initialPost?.id && !isServer && !loadedRef.current) {
        store.dispatch(
            postsApi.util.upsertQueryData('getPostById', initialPost.id || postId, { ...initialPost })
        )

        loadedRef.current = true
    }

    return (
        <div className='mx-2 lg:mx-0'>
            <PostCard post={data!} initialCommentsVisible={true} />
        </div>
    )
}
