import { User } from "@interfaces/user.interfaces"
import { baseApi } from "./baseApi"
import { ListResponse, Media } from "@interfaces/index.interfaces"

const usersPerPage = process.env.NEXT_PUBLIC_USERS_PER_PAGE
const mediaPerPage = process.env.NEXT_PUBLIC_MEDIA_PER_PAGE

export const usersApi = baseApi.injectEndpoints( {
        endpoints: ( build ) => ( {
            getCurrentUser: build.query<User, void>( {
                query: () => `/users/me`,
                providesTags: ['CurrentUser']
            } ),

            getUserById: build.query<User, string>( {
                query: ( userId ) => `/users/${ userId }`,
                providesTags: ['User']
            } ),

            getUserByUsername: build.query<User, string>( {
                query: ( username ) => `/users/by/username/${ username }`,
                providesTags: ['User']
            } ),

            getSuggestedUsers: build.query<ListResponse<User>, number>( {
                query: ( page ) => ( {
                    url: `/users/suggestions`,
                    params: { page, limit: usersPerPage }
                } ),
                providesTags: ['Users']
            } ),

            searchUsers: build.query<ListResponse<User>, { key: string, page?: number }>( {
                query: ( params ) => ( {
                    url: `/users/search`,
                    params: { ...params, limit: usersPerPage }
                } ),
                providesTags: ['Users']
            } ),

            changeProfilePhoto: build.mutation<User, FormData>( {
                query: ( data ) => ( {
                    url: `/users/me/avatar`,
                    method: 'POST',
                    body: data
                } ),
                invalidatesTags: ['User']
            } ),

            changeCoverPhoto: build.mutation<User, FormData>( {
                query: ( data ) => ( {
                    url: `/users/me/cover_photo`,
                    method: 'POST',
                    body: data
                } ),
                invalidatesTags: ['User']
            } ),

            follow: build.mutation<User, string>( {
                query: ( targetUserId ) => ( {
                    url: `/users/follow/${ targetUserId }`,
                    method: 'POST',
                } ),
                invalidatesTags: ( result, error, arg ) => ( [
                    'Users',
                    { type: 'User', id: arg }
                ] )
            } ),

            unfollow: build.mutation<User, string>( {
                query: ( targetUserId ) => ( {
                    url: `/users/unfollow/${ targetUserId }`,
                    method: 'POST',
                } ),
                invalidatesTags: ( result, error, arg ) => ( [
                    'Users',
                    { type: 'User', id: arg }
                ] )
            } ),

            getFollowers: build.query<ListResponse<User>, { userId: string, page?: number }>( {
                query: ( { userId, page } ) => ( {
                    url: `/users/${ userId }/followers`,
                    params: { page, limit: usersPerPage }
                } ),
                providesTags: ['Users']
            } ),

            getFollowersCount: build.query<{ count: number }, string>( {
                query: ( userId ) => ( {
                    url: `/users/${ userId }/followers/count`
                } ),
                providesTags: ['Users']
            } ),

            getFollowings: build.query<ListResponse<User>, { userId: string, page?: number }>( {
                query: ( { userId, page } ) => ( {
                    url: `/users/${ userId }/followings`,
                    params: { page, limit: usersPerPage }
                } ),
                providesTags: ['Users']
            } ),

            getFollowingsCount: build.query<{ count: number }, string>( {
                query: ( userId ) => ( {
                    url: `/users/${ userId }/followers/count`
                } ),
                providesTags: ['Users']
            } ),

            getMediaList: build.query<ListResponse<Media>, { userId: string, page?: number }>( {
                query: ( { userId, page } ) => ( {
                    url: `/users/${ userId }/media`,
                    params: { page, limit: mediaPerPage }
                } ),
                providesTags: ['UserMedia']
            } ),
        } ),
    }
)

export const {
                 useGetCurrentUserQuery,
                 useChangeProfilePhotoMutation,
                 useChangeCoverPhotoMutation,
                 useGetUserByIdQuery,
                 useGetUserByUsernameQuery,
                 useGetSuggestedUsersQuery,
                 useFollowMutation,
                 useUnfollowMutation,
                 useGetFollowersQuery,
                 useGetFollowingsQuery,
                 useSearchUsersQuery,
                 useGetMediaListQuery
             } = usersApi