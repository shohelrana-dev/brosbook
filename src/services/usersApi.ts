import { User } from "@interfaces/user.interfaces"
import { baseApi } from "./baseApi"
import { ListResponse } from "@interfaces/index.interfaces"

export const usersApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getCurrentUser: build.query<User, void>( {
            query: () => `/users/me`,
            providesTags: ['User']
        } ),

        getUserById: build.query<User, string>( {
            query: ( userId ) => `/users/${ userId }`,
            providesTags: ['User']
        } ),

        getUserByUsername: build.query<User, string>( {
            query: ( username ) => `/users/by/username/${ username }`,
            providesTags: ['User']
        } ),

        getSuggestedUsers: build.query<ListResponse<User>, { page: number, limit?: number }>( {
            query: ( params ) => ( {
                url: `/users/suggestions`,
                params
            } )
        } ),

        searchUsers: build.query<ListResponse<User>, { key: string, page: number, limit?: number }>( {
            query: ( params ) => ( {
                url: `/users/search`,
                params
            } )
        } ),

        changeProfilePhoto: build.mutation<User, FormData>( {
            query: ( payload ) => ( {
                url: `/users/me/avatar`,
                method: 'POST',
                body: payload
            } ),
            invalidatesTags: ['User']
        } ),

        changeCoverPhoto: build.mutation<User, FormData>( {
            query: ( payload ) => ( {
                url: `/users/me/cover_photo`,
                method: 'POST',
                body: payload
            } ),
            invalidatesTags: ['User']
        } ),

        follow: build.mutation<User, string>( {
            query: ( targetUserId ) => ( {
                url: `/users/follow/${ targetUserId }`,
                method: 'POST',
            } ),
            invalidatesTags: ['Following']
        } ),

        unfollow: build.mutation<User, string>( {
            query: ( targetUserId ) => ( {
                url: `/users/unfollow/${ targetUserId }`,
                method: 'POST',
            } ),
            invalidatesTags: ['Following']
        } ),

        getFollowers: build.query<ListResponse<User>, { userId: string, page: number, limit?: number }>( {
            query: ( { userId, ...params } ) => ( {
                url: `/users/${ userId }/followers`,
                params
            } ),
            providesTags: ['Following']
        } ),

        getFollowersCount: build.query<{ count: number }, string>( {
            query: ( userId ) => ( {
                url: `/users/${ userId }/followers/count`
            } ),
            providesTags: ['Following']
        } ),

        getFollowings: build.query<ListResponse<User>, { userId: string, page: number, limit?: number }>( {
            query: ( { userId, ...params } ) => ( {
                url: `/users/${ userId }/followings`,
                params
            } ),
            providesTags: ['Following']
        } ),

        getFollowingsCount: build.query<{ count: number }, string>( {
            query: ( userId ) => ( {
                url: `/users/${ userId }/followers/count`
            } ),
            providesTags: ['Following']
        } ),
    } ),
} )

export const {
                 useGetCurrentUserQuery,
                 useChangeProfilePhotoMutation,
                 useChangeCoverPhotoMutation,
                 useGetUserByUsernameQuery,
                 useGetSuggestedUsersQuery,
                 useFollowMutation,
                 useUnfollowMutation,
                 useGetFollowersQuery,
                 useGetFollowingsQuery,
                 useGetFollowersCountQuery,
                 useGetFollowingsCountQuery,
                 useSearchUsersQuery
             } = usersApi