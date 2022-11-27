import {http} from "@boot/axios"
import PostCard from "@components/post/PostCard"
import {Post} from "@interfaces/posts.interfaces"

interface Props{
    params: {
        postId: string
    }
}

export default async function SinglePostPage({params}: Props) {
    const post = (await http.get<Post>(`/posts/${params.postId}`)).data

    return <PostCard post={post}/>
}