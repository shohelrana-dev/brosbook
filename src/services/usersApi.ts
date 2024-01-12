import { ListResponse, Media } from '~/interfaces/index.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { userLoggedIn } from '~/slices/authSlice'
import { MEDIA_PER_PAGE, SUGGESTIONS_PER_PAGE, USERS_PER_PAGE } from '~/utils/constants'
import listQueryExtraDefinitions from '~/utils/listQueryExtraDefinitions'
import { baseApi } from './baseApi'

export const usersApi = baseApi.injectEndpoints({
	endpoints: build => ({
		getCurrentUser: build.query<User, void>({
			query: () => `/users/me`,
			providesTags: ['CurrentUser'],
			onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
				try {
					const { data } = await queryFulfilled

					dispatch(userLoggedIn(data))
				} catch (err) {
					throw err
				}
			},
		}),

		getUserById: build.query<User, string>({
			query: userId => `/users/${userId}`,
			providesTags: (result, error, arg, meta) => [{ type: 'User', id: arg }],
		}),

		getUserByUsername: build.query<User, string>({
			query: username => `/users/by/username/${username}`,
			providesTags: (result, error, arg) => [{ type: 'User', id: arg }],
		}),

		getSuggestedUsers: build.query<ListResponse<User>, { page: number; limit?: number }>({
			query: ({ page, limit }) => ({
				url: `/users/suggestions`,
				params: { page, limit: limit ?? SUGGESTIONS_PER_PAGE },
			}),
			...listQueryExtraDefinitions,
		}),

		searchUsers: build.query<ListResponse<User>, { q: string; page: number }>({
			query: params => ({
				url: `/users/search`,
				params: { ...params, limit: USERS_PER_PAGE },
			}),
			...listQueryExtraDefinitions,
		}),

		changeProfilePhoto: build.mutation<User, FormData>({
			query: data => ({
				url: `/users/me/avatar`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['CurrentUser'],
		}),

		changeCoverPhoto: build.mutation<User, FormData>({
			query: data => ({
				url: `/users/me/cover_photo`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['CurrentUser'],
		}),

		follow: build.mutation<User, string>({
			query: targetUserId => ({
				url: `/users/follow/${targetUserId}`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'User', id: 'LIST' },
				{ type: 'User', id: arg },
			],
		}),

		unfollow: build.mutation<User, string>({
			query: targetUserId => ({
				url: `/users/unfollow/${targetUserId}`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'User', id: 'LIST' },
				{ type: 'User', id: arg },
			],
		}),

		getFollowers: build.query<ListResponse<User>, { userId: string; page?: number }>({
			query: ({ userId, page }) => ({
				url: `/users/${userId}/followers`,
				params: { page, limit: USERS_PER_PAGE },
			}),
			providesTags: [{ type: 'User', id: 'LIST' }],
			...listQueryExtraDefinitions,
		}),

		getFollowersCount: build.query<{ count: number }, string>({
			query: userId => ({
				url: `/users/${userId}/followers/count`,
			}),
			providesTags: [{ type: 'User', id: 'LIST' }],
		}),

		getFollowings: build.query<ListResponse<User>, { userId: string; page?: number }>({
			query: ({ userId, page }) => ({
				url: `/users/${userId}/followings`,
				params: { page, limit: USERS_PER_PAGE },
			}),
			providesTags: [{ type: 'User', id: 'LIST' }],
			...listQueryExtraDefinitions,
		}),

		getFollowingsCount: build.query<{ count: number }, string>({
			query: userId => ({
				url: `/users/${userId}/followers/count`,
			}),
			providesTags: [{ type: 'User', id: 'LIST' }],
		}),

		getMediaList: build.query<ListResponse<Media>, { userId: string; page?: number }>({
			query: ({ userId, page }) => ({
				url: `/users/${userId}/media`,
				params: { page, limit: MEDIA_PER_PAGE },
			}),
			providesTags: ['UserMedia'],
			...listQueryExtraDefinitions,
		}),
	}),
})

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
	useGetMediaListQuery,
} = usersApi
