import { ListResponse } from '~/interfaces/index.interfaces'
import { Post } from '~/interfaces/posts.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { http } from '~/lib/axiosInstance'

export async function getCurrentUser() {
    return (await http.get<User>(`/users/me`)).data
}

export async function getUserByUsername(username: string) {
    return (await http.get<User>(`/users/by/username/${username}`)).data
}

export async function getFollowersCount(userId: string) {
    return (await http.get<{ count: number }>(`/users/${userId}/followers/count`)).data
}

export async function getFollowingsCount(userId: string) {
    return (await http.get<{ count: number }>(`/users/${userId}/followings/count`)).data
}

export async function getFeedPosts() {
    return (await http.get<ListResponse<Post>>(`/posts/feed`)).data
}

export async function getPostById(postId: string) {
    return (await http.get<Post>(`/posts/${postId}`)).data
}

export async function getPostsByAuthorId(authorId: string) {
    return (await http.get<ListResponse<Post>>(`/posts?authorId=${authorId}`)).data
}
