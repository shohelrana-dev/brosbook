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

        getSuggestedUsers: build.query<ListResponse<User>, { page?: number, limit?: number }>( {
            query: ( params ) => ( {
                url: `/users/suggestions`,
                params
            } ),
            providesTags: ['User']
        } ),

        searchUsers: build.query<ListResponse<User>, { key: string, page?: number, limit?: number }>( {
            query: ( params ) => ( {
                url: `/users/search`,
                params
            } ),
            providesTags: ['User']
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
            invalidatesTags: ['User']
        } ),

        unfollow: build.mutation<User, string>( {
            query: ( targetUserId ) => ( {
                url: `/users/unfollow/${ targetUserId }`,
                method: 'POST',
            } ),
            invalidatesTags: ['User']
        } ),

        getFollowers: build.query<ListResponse<User>, { userId: string, page?: number, limit?: number }>( {
            query: ( { userId, ...params } ) => ( {
                url: `/users/${ userId }/followers`,
                params
            } ),
            providesTags: ['User']
        } ),

        getFollowersCount: build.query<{ count: number }, string>( {
            query: ( userId ) => ( {
                url: `/users/${ userId }/followers/count`
            } ),
            providesTags: ['User']
        } ),

        getFollowings: build.query<ListResponse<User>, { userId: string, page?: number, limit?: number }>( {
            query: ( { userId, ...params } ) => ( {
                url: `/users/${ userId }/followings`,
                params
            } ),
            providesTags: ['User']
        } ),

        getFollowingsCount: build.query<{ count: number }, string>( {
            query: ( userId ) => ( {
                url: `/users/${ userId }/followers/count`
            } ),
            providesTags: ['User']
        } ),

        getMediaList: build.query<ListResponse<User>, { userId: string, page?: number, limit?: number }>( {
            query: ( { userId, ...params } ) => ( {
                url: `/users/${ userId }/media`,
                params
            } ),
            providesTags: ['User']
        } ),
    } ),
} )

export const {
                 useGetCurrentUserQuery,
                 useLazyGetCurrentUserQuery,
                 useChangeProfilePhotoMutation,
                 useChangeCoverPhotoMutation,
                 useGetUserByUsernameQuery,
                 useGetSuggestedUsersQuery,
                 useFollowMutation,
                 useUnfollowMutation,
                 useGetFollowersQuery,
                 useGetFollowingsQuery,
                 useSearchUsersQuery,
                 useGetMediaListQuery
             } = usersApi