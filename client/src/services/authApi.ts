import { createApi, fetchBaseQuery }                      from '@reduxjs/toolkit/query/react'
import { Credentials, ResetPassFormData, SignupFormData } from "@interfaces/auth.interfaces"
import { User }                                           from "@interfaces/user.interfaces"

const baseUrl = `${ process.env.NEXT_PUBLIC_SERVER_API_URL }/auth/`

type FetchData = {
    message: string
    success: boolean
    user?: User
}

export const authApi = createApi( {
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery( { baseUrl } ),
    endpoints: ( build ) => ( {
        signup: build.mutation<FetchData, SignupFormData>( {
            query: ( formData ) => ( {
                url: `signup`,
                method: 'POST',
                body: formData
            } )
        } ),
        login: build.mutation<FetchData, Credentials>( {
            query: ( credentials ) => ( {
                url: `login`,
                method: 'POST',
                body: credentials,
                credentials: 'include'
            } )
        } ),
        loginWithGoogle: build.mutation<FetchData, string>( {
            query: ( token ) => ( {
                url: `google`,
                method: 'POST',
                body: { token },
                credentials: 'include'
            } )
        } ),
        logout: build.query<FetchData, void>( {
            query: () => ( {
                url: `logout`,
                method: 'GET',
                credentials: 'include'
            } )
        } ),
        forgotPassword: build.mutation<FetchData, string>( {
            query: ( email ) => ( {
                url: `forgot_password`,
                method: 'POST',
                body: { email }
            } )
        } ),
        resetPassword: build.mutation<FetchData, ResetPassFormData>( {
            query: ( formData ) => ( {
                url: `reset_password/${ formData.token }`,
                method: 'POST',
                body: formData
            } )
        } ),
        verifyAccount: build.mutation<FetchData, string>( {
            query: ( token ) => `reset_password/${ token }`
        } ),
    } ),
} )

export const {
                 useSignupMutation,
                 useLoginMutation,
                 useLoginWithGoogleMutation,
                 useLogoutQuery,
                 useForgotPasswordMutation,
                 useResetPasswordMutation,
                 useVerifyAccountMutation
             } = authApi