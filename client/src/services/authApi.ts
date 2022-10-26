import { CredentialPayload, ResetPassPayload, SignupPayload } from "@interfaces/auth.interfaces"
import { User }                                               from "@interfaces/user.interfaces"
import { baseApi }                                            from "@services/baseApi"

export type LoginResponse = {
    access_token: string
    expires_in: string | number
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
            } )
        } ),

        loginWithGoogle: build.mutation<LoginResponse, string>( {
            query: ( token ) => ( {
                url: `/auth/google`,
                method: 'POST',
                body: { token },
            } )
        } ),

        forgotPassword: build.mutation<{ message: string }, string>( {
            query: ( email ) => ( {
                url: `/auth/forgot_password`,
                method: 'POST',
                body: { email }
            } )
        } ),

        resetPassword: build.mutation<{ message: string }, ResetPassPayload>( {
            query: ({token, ...payload} ) => ( {
                url: `/auth/reset_password/${token}`,
                method: 'POST',
                body: payload
            } )
        } ),

        verifyEmail: build.mutation<User, string>( {
            query: ( token ) => (  `/auth/email_verification/${token}`  )
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