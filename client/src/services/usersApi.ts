import {User} from "@interfaces/user.interfaces"
import {baseApi} from "./baseApi"
import {ListResponse} from "@interfaces/index.interfaces"
import {Post} from "@interfaces/posts.interfaces"

export const usersApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getCurrentUser: build.query<User, void>({
            query: () => `users/me`
        }),

        getUserByUsername: build.query<User, string>({
            query: (username) => `users/${username}`
        }),

        getSuggestedUsers: build.query<ListResponse<User>, { page: number, limit?: number }>({
            query: (params) => ({
                url: `users/suggest`,
                params
            })
        }),

        getUserPosts: build.query<ListResponse<Post>, { userId: string, page: number, limit?: number }>({
            query: ({userId, ...params}) => ({
                url: `users/${userId}/posts`,
                params: params
            })
        }),

        changeProfilePhoto: build.mutation<User, FormData>({
            query: (payload) => ({
                url: `users/me/avatar`,
                method: 'POST',
                body: payload
            })
        }),

        changeCoverPhoto: build.mutation<User, FormData>({
            query: (payload) => ({
                url: `users/me/cover_photo`,
                method: 'POST',
                body: payload
            })
        }),

        follow: build.mutation<User, string>({
            query: (targetUserId) => ({
                url: `users/follow/${targetUserId}`,
                method: 'POST',
            })
        }),

        unfollow: build.mutation<User, string>({
            query: (targetUserId) => ({
                url: `users/unfollow/${targetUserId}`,
                method: 'POST',
            })
        }),

        getFollowers: build.query<ListResponse<User>, { userId: string, page: number, limit?: number }>({
            query: ({userId, ...params}) => ({
                url: `users/${userId}/followers`,
                params
            })
        }),

        getFollowing: build.query<ListResponse<User>, { userId: string, page: number, limit?: number }>({
            query: ({userId, ...params}) => ({
                url: `users/${userId}/following`,
                params
            })
        }),
    }),
})

export const {
    useGetCurrentUserQuery,
    useChangeProfilePhotoMutation,
    useChangeCoverPhotoMutation,
    useGetUserByUsernameQuery,
    useGetSuggestedUsersQuery,
    useGetUserPostsQuery,
    useFollowMutation,
    useUnfollowMutation,
    useGetFollowersQuery,
    useGetFollowingQuery
} = usersApi