import ProfilePostsPage from "./ProfilePostsPage"
import {http} from "@boot/axios"
import authorizationConfig from "@utils/authorizationConfig"
import {cookies} from "next/headers"


interface Props {
    params: {username: string}
}

export default async function Page({params}: Props) {
    const config = authorizationConfig(cookies())
    const user = ( await http.get(`/users/${params.username}`, config)).data
    const posts = ( await http.get(`/users/${user.id}/posts`, config)).data

    return <ProfilePostsPage user={user} initialPosts={posts}/>
}
