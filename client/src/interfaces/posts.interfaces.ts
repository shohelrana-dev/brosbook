import { User }         from "@interfaces/user.interfaces"

export interface Post {
    id: string
    username: string
    body: string
    likeCount: number
    comments: Comment[]
    commentCount: number
    isViewerLiked: boolean
    author: User
    photo: string
    createdAt: string
    updatedAt: string
}

export interface Comment {
    id: string
    username: string
    author: User
    isViewerLiked: boolean
    likeCount: number
    postId: string
    body: string
    createdAt: string
    updatedAt: string
}