import { User }         from "@interfaces/user.interfaces"
import { appApi }       from "./appApi"
import { Post }         from "@interfaces/posts.interfaces";
import { PaginateMeta } from "@interfaces/index.interfaces";

type FetchData = {
    message: string
    success: boolean
    users?: User[]
    user?: User
    posts?: Post[]
    meta?: PaginateMeta
}

export const usersApi = appApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getUser: build.query<FetchData, string>( {
            query: ( username ) => ( {
                url: `users/${ username }`,
                credentials: 'include'
            } ),
        } ),

        getUserPosts: build.query<FetchData, { username: string, page?: number, limit?: number }>( {
            query: ( args ) => ( {
                url: `users/${ args.username }/posts`,
                params: args
            } ),
        } ),

        follow: build.mutation<FetchData, string>( {
            query: ( target ) => ( {
                url: `users/follow?target=${ target }`,
                method: 'POST',
                credentials: 'include'
            } ),
        } ),

        unfollow: build.mutation<FetchData, string>( {
            query: ( target ) => ( {
                url: `users/unfollow?target=${ target }`,
                method: 'POST',
                credentials: 'include'
            } ),
        } ),
    } ),
} )

export const { useGetUserQuery, useGetUserPostsQuery, useFollowMutation, useUnfollowMutation } = usersApi