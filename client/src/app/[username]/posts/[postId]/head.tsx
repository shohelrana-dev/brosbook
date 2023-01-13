import {ReactNode} from 'react'
import {http} from "@boot/axios"
import {Post} from "@interfaces/posts.interfaces"

interface Props{
    params: {
        postId: string
    },
    children: ReactNode
}

export default async function Head(props: Props) {
    const post = (await http.get<Post>(`/posts/${props.params.postId}`)).data
    return (
        <>
            <title>{post.body || 'Post Image'}</title>
        </>
    )
}