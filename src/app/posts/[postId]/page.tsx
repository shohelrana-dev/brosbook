import { http } from "@boot/axios"
import PostCard from "@components/post/PostCard"
import { Post } from "@interfaces/posts.interfaces"
import SidebarLayout from "@components/common/SidebarLayout"

interface Props {
    params: {
        postId: string
    }
}

export default async function SinglePostPage( { params }: Props ){
    const post = ( await http.get<Post>( `/posts/${ params.postId }` ) ).data

    return (
        <SidebarLayout>
            <PostCard post={ post } isCommentsShow={ true }/>
        </SidebarLayout>
    )
}