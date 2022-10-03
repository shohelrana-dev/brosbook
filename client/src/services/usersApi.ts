import { User }         from "@interfaces/user.interfaces"
import { baseApi }      from "./baseApi"
import { ListResponse } from "@interfaces/index.interfaces"
import { Post }         from "@interfaces/posts.interfaces"

export const usersApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getOneUser: build.query<User, string>( {
            query: ( username ) => `users/${ username }`
        } ),

        getManyUser: build.query<ListResponse<User>, { page: number, limit?: number }>( {
            query: ( params ) => ( {
                url: `users`,
                params
            } )
        } ),

        getUserManyPost: build.query<ListResponse<Post>, { userId: number, page: number, limit?: number }>( {
            query: ( { userId, ...params } ) => ( {
                url: `users/${ userId }/posts`,
                params: params
            } )
        } ),

        follow: build.mutation<User, string>( {
            query: ( target ) => ( {
                url: `users/follow?target=${ target }`,
                method: 'POST',
            } )
        } ),

        unfollow: build.mutation<User, string>( {
            query: ( target ) => ( {
                url: `users/unfollow?target=${ target }`,
                method: 'POST',
            } )
        } ),

        getFollowers: build.query<ListResponse<User>, { userId: number, page: number, limit?: number }>( {
            query: ( { userId, ...params } ) => ( {
                url: `users/${ userId }/followers`,
                params
            } )
        } ),

        getFollowing: build.query<ListResponse<User>, { userId: number, page: number, limit?: number }>( {
            query: ( { userId, ...params } ) => ( {
                url: `users/${ userId }/following`,
                params
            } )
        } ),
    } ),
} )

export const {
                 useGetOneUserQuery,
                 useGetManyUserQuery,
                 useGetUserManyPostQuery,
                 useFollowMutation,
                 useUnfollowMutation,
                 useGetFollowersQuery,
                 useGetFollowingQuery
             } = usersApi