import { User }    from "@interfaces/user.interfaces"
import { baseApi } from "./baseApi"
import { Post }    from "@interfaces/posts.interfaces";
import { PaginateMeta } from "@interfaces/index.interfaces";

type FetchData = {
    message: string
    success: boolean
    users?: User[]
    user?: User
    posts?: Post[]
    meta?: PaginateMeta
}

export const usersApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getUser: build.query<FetchData, string>( {
            query: ( username ) => `users/${ username }`
        } ),

        getUserPosts: build.query<FetchData, { username: string, page?: number, limit?: number }>( {
            query: ( params ) => ( {
                url: `users/${ params.username }/posts`,
                params: params
            } )
        } ),

        follow: build.mutation<FetchData, string>( {
            query: ( target ) => ( {
                url: `users/follow?target=${ target }`,
                method: 'POST',
            } )
        } ),

        unfollow: build.mutation<FetchData, string>( {
            query: ( target ) => ( {
                url: `users/unfollow?target=${ target }`,
                method: 'POST',
            } )
        } ),
    } ),
} )

export const { useGetUserQuery, useGetUserPostsQuery, useFollowMutation, useUnfollowMutation } = usersApi