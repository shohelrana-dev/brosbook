import { baseApi } from "./baseApi"
import { User } from "@interfaces/user.interfaces"
import { ChangePasswordPayload, ProfilePayload } from "@interfaces/account.interfaces"

export const accountApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        updateProfile: build.mutation<User, ProfilePayload>({
            query: (data) => ({
                url: `/account/profile`,
                method: 'PUT',
                body: data
            })
        }),

        changePassword: build.mutation<User, ChangePasswordPayload>({
            query: (data) => ({
                url: `/account/password`,
                method: 'PUT',
                body: data
            })
        }),

    }),
})

export const { useUpdateProfileMutation, useChangePasswordMutation } = accountApi