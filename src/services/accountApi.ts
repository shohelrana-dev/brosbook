import { toast } from 'sonner'
import {
    ChangePasswordPayload,
    ChangeUsernamePayload,
    ProfilePayload,
} from '~/interfaces/account.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { baseApi } from './baseApi'

export const accountApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        updateProfile: build.mutation<User, ProfilePayload>({
            query: (data) => ({
                url: `/account/profile`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['CurrentUser'],
            onQueryStarted: async (_, api) => {
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Updating profile...',
                    success: 'Profile updated.',
                    error: (err) => err.error?.data?.message,
                })
            },
        }),

        changeUsername: build.mutation<User, ChangeUsernamePayload>({
            query: (data) => ({
                url: `/account/username`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['CurrentUser'],
            onQueryStarted: async (_, api) => {
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Updating username...',
                    success: 'Username updated.',
                    error: (err) => err.error?.data?.message,
                })
            },
        }),

        changePassword: build.mutation<User, ChangePasswordPayload>({
            query: (data) => ({
                url: `/account/password`,
                method: 'PATCH',
                body: data,
            }),
            onQueryStarted: async (_, api) => {
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Updating password...',
                    success: 'Password updated.',
                    error: (err) => err.error?.data?.message,
                })
            },
        }),
    }),
})

export const { useUpdateProfileMutation, useChangeUsernameMutation, useChangePasswordMutation } =
    accountApi
