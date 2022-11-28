import Post from "@entities/Post"
import {Auth} from "@api/types/index.types"
import Like from "@entities/Like"
import Relationship from "@entities/Relationship"

export default async function formatPost(post: Post, auth: Auth): Promise<Post>{
    const like = await Like.findOneBy({userId: auth.user.id, postId: post.id})
    const relationship = await Relationship.findOneBy({followerId: auth.user.id, followedId: post.author.id})

    post.isViewerLiked = Boolean(like)
    post.author.isViewerFollow = Boolean(relationship)

    return post
}