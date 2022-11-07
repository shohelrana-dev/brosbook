import {http} from "@boot/axios"
import {AxiosResponse} from "axios"
import {User} from "@interfaces/user.interfaces"
import {ListResponse} from "@interfaces/index.interfaces"
import {Post} from "@interfaces/posts.interfaces"


export async function getCurrentUser() {
    const res: AxiosResponse<User> = await http('users/me')

    return res.data
}

export async function getUserByUsername(username: string) {
    const res: AxiosResponse<User> = await http(`users/${username}`)

    return res.data
}

export async function getSuggestedUsers(payload: { page: number, limit?: number }){
    const res: AxiosResponse<ListResponse<User>> = await http.request({
        url: `users/suggest`,
        params: payload
    })

    return res.data
}

export async function getUserPosts(payload: {userId: string, page: number, limit?: number }) {
    const res: AxiosResponse<ListResponse<Post>> = await http.request({
        url: `users/${payload.userId}/posts`,
        params: payload
    })

    return res.data
}

export async function follow(targetUserId: string) {
    const res: AxiosResponse<User> = await http.request({
        url: `users/follow/${ targetUserId }`,
        method: 'POST'
    })

    return res.data
}

export async function unfollow(targetUserId: string) {
    const res: AxiosResponse<User> = await http.request({
        url: `users/unfollow/${ targetUserId }`,
        method: 'POST'
    })

    return res.data
}

export async function getFollowers(payload: {userId: string, page: number, limit?: number }) {
    const res: AxiosResponse<ListResponse<User>> = await http.request({
        url: `users/${ payload.userId }/followers`,
        params: payload
    })

    return res.data
}

export async function getFollowing(payload: {userId: string, page: number, limit?: number }) {
    const res: AxiosResponse<ListResponse<User>> = await http.request({
        url: `users/${ payload.userId }/following`,
        params: payload
    })

    return res.data
}