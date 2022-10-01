import { CredentialPayload, ResetPassPayload, SignupPayload } from "@interfaces/auth.interfaces"
import { User }                                               from "@interfaces/user.interfaces"
import { baseApi }                                            from "@services/baseApi"

type LoginResponse = {
    access_token: string
    expiresIn: string | number
    token_type: string
    user: User
}

export const authApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        signup: build.mutation<User, SignupPayload>( {
            query: ( formData ) => ( {
                url: `/auth/signup`,
                method: 'POST',
                body: formData
            } )
        } ),

        login: build.mutation<LoginResponse, CredentialPayload>( {
            query: ( credentials ) => ( {
                url: `/auth/login`,
                method: 'POST',
                body: credentials
            } )
        } ),

        loginWithGoogle: build.mutation<LoginResponse, string>( {
            query: ( token ) => ( {
                url: `/auth/google`,
                method: 'POST',
                body: { token },
            } )
        } ),

        getAuthUser: build.query<User, string | void>( {
            query: ( access_token?: string ) => ( {
                url: `/auth/me`,
                headers: {
                    Authorization: access_token ? `Bearer ${ access_token }` : ''
                }
            } )
        } ),

        forgotPassword: build.mutation<{ message: string }, string>( {
            query: ( email ) => ( {
                url: `/auth/forgot-password`,
                method: 'POST',
                body: { email }
            } )
        } ),

        resetPassword: build.mutation<{ message: string }, ResetPassPayload>( {
            query: ( formData ) => ( {
                url: `/auth/reset-password`,
                method: 'POST',
                body: formData
            } )
        } ),

        verifyAccount: build.mutation<User, { email: string, key: string }>( {
            query: ( data ) => ( {
                url: `/auth/verify-account`,
                params: data
            } )
        } ),
    } ),
} )

export const {
                 useSignupMutation,
                 useLoginMutation,
                 useLoginWithGoogleMutation,
                 useGetAuthUserQuery,
                 useForgotPasswordMutation,
                 useResetPasswordMutation,
                 useVerifyAccountMutation
             } = authApi