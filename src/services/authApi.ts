import { CredentialPayload, ResetPassPayload, SignupPayload } from "@interfaces/auth.interfaces"
import { User } from "@interfaces/user.interfaces"
import { baseApi } from "@services/baseApi"
import { setAuth } from "@slices/authSlice"
import Cookies from "js-cookie"

export type LoginResponse = {
    access_token: string
    expires_in: number
    token_type: string
    user: User
}

export const authApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        signup: build.mutation<User, SignupPayload>( {
            query: ( payload ) => ( {
                url: `/auth/signup`,
                method: 'POST',
                body: payload
            } )
        } ),

        login: build.mutation<LoginResponse, CredentialPayload>( {
            query: ( credentials ) => ( {
                url: `/auth/login`,
                method: 'POST',
                body: credentials
            } ),
            invalidatesTags: ["User"],
            onQueryStarted: async( arg, { dispatch, queryFulfilled } ) => {
                try {
                    const { data } = await queryFulfilled
                    dispatch( setAuth( data.user ) )
                    Cookies.set( 'access_token', data.access_token, {
                        expires: data.expires_in,
                        secure: true,
                        sameSite: "strict"
                    } )
                } catch ( e ) {
                    console.log( e )
                }
            }
        } ),

        loginWithGoogle: build.mutation<LoginResponse, string>( {
            query: ( token ) => ( {
                url: `/auth/google`,
                method: 'POST',
                body: { token },
            } ),
            invalidatesTags: ["User"],
            onQueryStarted: async( arg, { dispatch, queryFulfilled } ) => {
                try {
                    const { data } = await queryFulfilled
                    dispatch( setAuth( data.user ) )
                    Cookies.set( 'access_token', data.access_token, {
                        expires: data.expires_in,
                        secure: true,
                        sameSite: "strict"
                    } )
                } catch ( e ) {
                    console.log( e )
                }
            }
        } ),

        forgotPassword: build.mutation<{ message: string }, { email: string }>( {
            query: ( payload ) => ( {
                url: `/auth/forgot_password`,
                method: 'POST',
                body: payload
            } )
        } ),

        resetPassword: build.mutation<{ message: string }, ResetPassPayload>( {
            query: ( { token, ...payload } ) => ( {
                url: `/auth/reset_password/${ token }`,
                method: 'POST',
                body: payload
            } )
        } ),

        verifyEmail: build.mutation<User, string>( {
            query: ( token ) => ( `/auth/email_verification/${ token }` )
        } ),

        resendVerificationLink: build.mutation<void, string>( {
            query: ( email ) => ( {
                url: `/auth/email_verification/resend`,
                method: 'POST',
                body: { email }
            } )
        } ),
    } ),
} )

export const {
                 useSignupMutation,
                 useLoginMutation,
                 useLoginWithGoogleMutation,
                 useForgotPasswordMutation,
                 useResetPasswordMutation,
                 useVerifyEmailMutation,
                 useResendVerificationLinkMutation
             } = authApi