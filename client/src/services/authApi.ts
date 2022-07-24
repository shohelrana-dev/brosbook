import { Credentials, ResetPassFormData, SignupFormData } from "@interfaces/auth.interfaces"
import { User }                                           from "@interfaces/user.interfaces"
import { appApi }                                         from "@services/appApi"

type FetchData = {
    message: string
    success: boolean
    user?: User
}

export const authApi = appApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        signup: build.mutation<FetchData, SignupFormData>( {
            query: ( formData ) => ( {
                url: `auth/signup`,
                method: 'POST',
                body: formData
            } )
        } ),
        login: build.mutation<FetchData, Credentials>( {
            query: ( credentials ) => ( {
                url: `auth/login`,
                method: 'POST',
                body: credentials,
                credentials: 'include'
            } )
        } ),
        loginWithGoogle: build.mutation<FetchData, string>( {
            query: ( token ) => ( {
                url: `auth/google`,
                method: 'POST',
                body: { token },
                credentials: 'include'
            } )
        } ),
        getAuthUser: build.query<FetchData, void>( {
            query: () => ( {
                url: `auth/me`,
                credentials: 'include'
            } )
        } ),
        logout: build.query<FetchData, void>( {
            query: () => ( {
                url: `auth/logout`,
                method: 'GET',
                credentials: 'include'
            } )
        } ),
        forgotPassword: build.mutation<FetchData, string>( {
            query: ( email ) => ( {
                url: `auth/forgot_password`,
                method: 'POST',
                body: { email }
            } )
        } ),
        resetPassword: build.mutation<FetchData, ResetPassFormData>( {
            query: ( formData ) => ( {
                url: `auth/reset_password/${ formData.token }`,
                method: 'POST',
                body: formData
            } )
        } ),
        verifyAccount: build.mutation<FetchData, string>( {
            query: ( token ) => `auth/reset_password/${ token }`
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