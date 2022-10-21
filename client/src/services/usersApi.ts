import { User }         from "@interfaces/user.interfaces"
import { baseApi }      from "./baseApi"
import { ListResponse } from "@interfaces/index.interfaces"
import { Post }         from "@interfaces/posts.interfaces"

export const usersApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getUser: build.query<User, string>( {
            query: ( username ) => `users/${ username }`
        } ),

        getSuggestedUsers: build.query<ListResponse<User>, { page: number, limit?: number }>( {
            query: ( params ) => ( {
                url: `users/suggest`,
                params
            } )
        } ),

        getUserPosts: build.query<ListResponse<Post>, { userId: number, page: number, limit?: number }>( {
            query: ( { userId, ...params } ) => ( {
                url: `users/${ userId }/posts`,
                params: params
            } )
        } ),

        follow: build.mutation<User, number>( {
            query: ( targetUserId ) => ( {
                url: `users/follow/${ targetUserId }`,
                method: 'POST',
            } )
        } ),

        unfollow: build.mutation<User, number>( {
            query: ( targetUserId ) => ( {
                url: `users/unfollow/${ targetUserId }`,
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
                 useGetUserQuery,
                 useGetSuggestedUsersQuery,
                 useGetUserPostsQuery,
                 useFollowMutation,
                 useUnfollowMutation,
                 useGetFollowersQuery,
                 useGetFollowingQuery
             } = usersApi