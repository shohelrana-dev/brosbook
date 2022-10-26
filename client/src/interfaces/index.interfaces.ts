import { Post } from "@interfaces/posts.interfaces"
import { User } from "@interfaces/user.interfaces"

export interface ListResponse<T> {
    items: T[]
    count: number
    currentPage: number
    lastPage: number
    nextPage: number
    prevPage: number
}

export interface ProfileState {
    isLoadingUser: boolean
    isLoadingPosts: boolean
    isLoadingFollowers: boolean
    isLoadingFollowing: boolean
    user: User
    posts: Post[]
    followers: User[]
    following: User[]
}

export interface InputErrors {
    firstName?: string
    lastName?: string
    email?: string
    username?: string
    password?: string
    confirmPassword?: string
}
