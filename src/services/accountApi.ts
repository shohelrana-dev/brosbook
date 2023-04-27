import { baseApi } from "./baseApi"
import { User } from "@interfaces/user.interfaces"
import { ChangePasswordPayload, ChangeUsernamePayload, ProfilePayload } from "@interfaces/account.interfaces"

export const accountApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        updateProfile: build.mutation<User, ProfilePayload>( {
            query: ( data ) => ( {
                url: `/account/profile`,
                method: 'PUT',
                body: data
            } ),
            invalidatesTags: ['CurrentUser']
        } ),

        changeUsername: build.mutation<User, ChangeUsernamePayload>( {
            query: ( data ) => ( {
                url: `/account/username`,
                method: 'PUT',
                body: data
            } ),
            invalidatesTags: ['CurrentUser']
        } ),

        changePassword: build.mutation<User, ChangePasswordPayload>( {
            query: ( data ) => ( {
                url: `/account/password`,
                method: 'PUT',
                body: data
            } )
        } ),

    } ),
} )

export const { useUpdateProfileMutation, useChangeUsernameMutation, useChangePasswordMutation } = accountApi