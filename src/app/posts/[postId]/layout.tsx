import {ReactNode} from 'react'
import {http} from "@boot/axios"
import {Post} from "@interfaces/posts.interfaces"

interface Props{
    params: {
        postId: string
    },
    children: ReactNode
}

export const revalidate = 0

export default async function Layout( props: Props) {
    const post = (await http.get<Post>(`/posts/${props.params.postId}`)).data
    return (
        <>
            <title>{post.body || 'Post Image'}</title>
        </>
    )
}