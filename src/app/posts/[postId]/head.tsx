import { ReactNode } from 'react'
import { http } from "@boot/axios"
import { Post } from "@interfaces/posts.interfaces"
import DefaultTags from "@components/common/DefaultTags"

interface Props {
    params: {
        postId: string
    },
    children: ReactNode
}

export default async function Head( props: Props ){
    const post = ( await http.get<Post>( `/posts/${ props.params.postId }` ) ).data
    return (
        <>
            <DefaultTags/>
            <title>{ `${ post.body || 'Post image' } | ${ process.env.NEXT_PUBLIC_APP_NAME }` }</title>
        </>
    )
}