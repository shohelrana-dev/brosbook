import { http } from "@boot/axios"
import PostCard from "@components/post/PostCard"
import { Post } from "@interfaces/posts.interfaces"

interface Props {
    params: {
        postId: string
    }
}

export const dynamic = 'force-dynamic'

export default async function SinglePostPage( { params }: Props ){
    const post = ( await http.get<Post>( `/posts/${ params.postId }` ) ).data

    return (
        <>
            <head>
                <title>{ post.body || 'Post Image' }</title>
            </head>
            <div className="container">
                <PostCard post={ post }/>
            </div>
        </>
    )
}