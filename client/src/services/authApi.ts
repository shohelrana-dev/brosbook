import { CredentialPayload, ResetPassPayload, SignupPayload } from "@interfaces/auth.interfaces"
import { User }                                               from "@interfaces/user.interfaces"
import { baseApi }                                            from "@services/baseApi"

type FetchData = {
    message: string
    success: boolean
    user?: User
}

export const authApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        signup: build.mutation<FetchData, SignupPayload>( {
            query: ( formData ) => ( {
                url: `/auth/signup`,
                method: 'POST',
                body: formData
            } )
        } ),

        login: build.mutation<FetchData, CredentialPayload>( {
            query: ( CredentialPayload ) => ( {
                url: `/auth/login`,
                method: 'POST',
                body: CredentialPayload
            } )
        } ),

        loginWithGoogle: build.mutation<FetchData, string>( {
            query: ( token ) => ( {
                url: `/auth/google`,
                method: 'POST',
                body: { token },
            } )
        } ),

        getAuthUser: build.query<FetchData, string | void>( {
            query: ( access_token?: string ) => ( {
                url: `/auth/me`,
                headers: {
                    Authorization: access_token ? `Bearer ${ access_token }` : ''
                },
            } ),
            onQueryStarted: ( arg, api ) => {
                console.log( 'onQueryStarted' )
            }
        } ),

        logout: build.query<FetchData, void>( {
            query: () => `/auth/logout`,
        } ),

        forgotPassword: build.mutation<FetchData, string>( {
            query: ( email ) => ( {
                url: `/auth/forgot-password`,
                method: 'POST',
                body: { email }
            } )
        } ),

        resetPassword: build.mutation<FetchData, ResetPassPayload>( {
            query: ( formData ) => ( {
                url: `/auth/reset-password/${ formData.token }`,
                method: 'POST',
                body: formData
            } )
        } ),

        verifyAccount: build.mutation<FetchData, string>( {
            query: ( token ) => `/auth/reset-password/${ token }`
        } ),
    } ),
} )

export const {
                 useSignupMutation,
                 useLoginMutation,
                 useLoginWithGoogleMutation,
                 useGetAuthUserQuery,
                 useLogoutQuery,
                 useForgotPasswordMutation,
                 useResetPasswordMutation,
                 useVerifyAccountMutation
             } = authApi