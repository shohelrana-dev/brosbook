import {http} from "@boot/axios"
import {AxiosResponse} from "axios"
import {ListResponse} from "@interfaces/index.interfaces"
import {Post} from "@interfaces/posts.interfaces"


export async function getFeedPosts() {
    const res:AxiosResponse<ListResponse<Post>> = await http('posts/feed')

    return res.data
}

export async function createPost(payload: FormData) {
    const res: AxiosResponse<Post> = await http.request({
        url: 'posts',
        method: 'POST',
        data: payload
    })

    return res.data
}

export async function likePost(id: string) {
    const res: AxiosResponse<Post> = await http.request({
        url: `posts/${ id }/like`,
        method: 'POST',
    })

    return res.data
}

export async function unlikePost(id: string) {
    const res: AxiosResponse<Post> = await http.request({
        url: `posts/${ id }/unlike`,
        method: 'POST',
    })

    return res.data
}