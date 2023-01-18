import { User }         from "@interfaces/user.interfaces"
import {Media} from "@interfaces/index.interfaces"

export interface Post {
    id: string
    username: string
    body: string
    likesCount: number
    comments: Comment[]
    commentsCount: number
    isViewerLiked: boolean
    author: User
    image: Media
    createdAt: string
    updatedAt: string
}

export interface Comment {
    id: string
    username: string
    author: User
    isViewerLiked: boolean
    likesCount: number
    postId: string
    body: string
    createdAt: string
    updatedAt: string
}