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
      }),

      changeUsername: build.mutation<User, ChangeUsernamePayload>({
         query: (data) => ({
            url: `/account/username`,
            method: 'PATCH',
            body: data,
         }),
         invalidatesTags: ['CurrentUser'],
      }),

      changePassword: build.mutation<User, ChangePasswordPayload>({
         query: (data) => ({
            url: `/account/password`,
            method: 'PATCH',
            body: data,
         }),
      }),
   }),
})

export const { useUpdateProfileMutation, useChangeUsernameMutation, useChangePasswordMutation } =
   accountApi
