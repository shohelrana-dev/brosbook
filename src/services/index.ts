import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"
import { http } from "@utils/axiosInstance"
import getAuthorizationConfig from "@utils/getAuthorizationConfig"
import { User } from "@interfaces/user.interfaces"
import { Post } from "@interfaces/posts.interfaces"
import { ListResponse } from "@interfaces/index.interfaces"
import { Conversation } from "@interfaces/conversation.interfaces"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export async function getCurrentUser( cookies: RequestCookies | ReadonlyRequestCookies ) {
    try {
        const config = getAuthorizationConfig( cookies )
        
        const res    = await http.get<User>( `/users/me`, config )
        
        return res.data
    } catch ( err ) {
        return null
    }
}

export async function getUserByUsername( username: string, cookies: RequestCookies | ReadonlyRequestCookies ) {
    try {
        const config = getAuthorizationConfig( cookies )
        const res    = await http.get<User>( `/users/by/username/${ username }`, config )

        return res.data
    } catch ( e ) {
        return null
    }
}

export async function getFollowersCount( userId: string ) {
    try {
        const res = await http.get<{ count: number }>( `/users/${ userId }/followers/count` )

        return res.data
    } catch ( e ) {
        return null
    }
}

export async function getFollowingsCount( userId: string ) {
    try {
        const res = await http.get<{ count: number }>( `/users/${ userId }/followings/count` )

        return res.data
    } catch ( e ) {
        return null
    }
}

export async function getPostById( postId: string, cookies: RequestCookies | ReadonlyRequestCookies ) {
    try {
        const config = getAuthorizationConfig( cookies )
        const res    = await http.get<Post>( `/posts/${ postId }`, config )

        return res.data
    } catch ( e ) {
        return null
    }
}

export async function getPostsByAuthorId( authorId: string, cookies: RequestCookies | ReadonlyRequestCookies ) {
    try {
        const config = getAuthorizationConfig( cookies )
        const res    = await http.get<ListResponse<Post>>( `/posts?userId=${ authorId }`, config )

        return res.data
    } catch ( e ) {
        return null
    }
}

export async function getConversationById( conversationId: string, cookies: RequestCookies | ReadonlyRequestCookies ) {
    try {
        const config = getAuthorizationConfig( cookies )
        const res    = await http.get<Conversation>( `/conversations/${ conversationId }`, config )

        return res.data
    } catch ( e ) {
        return null
    }
}

export async function getConversations( cookies: RequestCookies | ReadonlyRequestCookies ) {
    try {
        const config = getAuthorizationConfig( cookies )
        const res    = await http.get<ListResponse<Conversation>>( `/conversations `, config )

        return res.data
    } catch ( e ) {
        return null
    }
}