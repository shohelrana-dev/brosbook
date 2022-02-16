import { User }         from "@interfaces/user.interfaces"
import { PaginateMeta } from "@interfaces/index.interfaces"

export interface PostsState {
    isLoadingPosts: boolean
    isUpdatingPost: boolean
    posts: Post[],
    postsMeta: PaginateMeta
}

export interface Post {
    id: number
    username: string
    content: string
    likeCount: number
    comments: Comment[]
    commentCount: number
    hasCurrentUserLike: boolean
    user: User
    photo: string
    createdAt?: string
    updatedAt?: string
}

export interface Comment {
    id: number
    username: string
    user: User
    hasCurrentUserLike: boolean
    likeCount: number
    postId: number
    content: string
    createdAt?: string
    updatedAt?: string
}