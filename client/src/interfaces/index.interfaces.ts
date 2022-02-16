import { Post } from "@interfaces/posts.interfaces"
import { User } from "@interfaces/user.interfaces"

export interface PaginateMeta {
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
    postsMeta: PaginateMeta
    followersMeta: PaginateMeta
    followingMeta: PaginateMeta
}
