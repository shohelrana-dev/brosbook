import { toast } from 'sonner'
import { removeCookie, setCookie } from 'tiny-cookie'
import {
    CredentialsPayload,
    LoginResponse,
    ResetPassPayload,
    SignupPayload,
} from '~/interfaces/auth.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { baseApi } from '~/services/baseApi'
import { userLoggedIn, userLoggedOut } from '~/slices/authSlice'

export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        signup: build.mutation<User, SignupPayload>({
            query: (payload) => ({
                url: `/auth/signup`,
                method: 'POST',
                body: payload,
            }),
            onQueryStarted: async (_, { queryFulfilled }) => {
                await queryFulfilled
                toast.success('Account created. Check your email for a link to verify your account.')
            },
        }),

        login: build.mutation<LoginResponse, CredentialsPayload>({
            query: (credentials) => ({
                url: `/auth/login`,
                method: 'POST',
                body: credentials,
                credentials: 'include',
            }),
            invalidatesTags: ['CurrentUser'],
            onQueryStarted: async (_, api) => {
                const { data } = await api.queryFulfilled
                const { user, accessToken } = data

                toast.success('Logged in.')
                api.dispatch(baseApi.util.resetApiState())
                api.dispatch(userLoggedIn(user))
                setCookie('accessToken', accessToken)
            },
        }),

        loginWithGoogle: build.mutation<LoginResponse, string>({
            query: (token) => ({
                url: `/auth/google`,
                method: 'POST',
                body: { token },
                credentials: 'include',
            }),
            invalidatesTags: ['CurrentUser'],
            onQueryStarted: async (arg, api) => {
                const { data } = await api.queryFulfilled
                const { user, accessToken } = data

                api.dispatch(userLoggedIn(user))
                setCookie('accessToken', accessToken)
            },
        }),

        forgotPassword: build.mutation<{ message: string }, { email: string }>({
            query: (payload) => ({
                url: `/auth/forgot_password`,
                method: 'POST',
                body: payload,
            }),
            onQueryStarted: async (_, api) => {
                await api.queryFulfilled
                toast.success('Check your email for a link to reset your password.')
            },
        }),

        resetPassword: build.mutation<{ message: string }, ResetPassPayload & { token: string }>({
            query: ({ token, ...payload }) => ({
                url: `/auth/reset_password/${token}`,
                method: 'POST',
                body: payload,
            }),
            onQueryStarted: async (_, api) => {
                await api.queryFulfilled
                toast.success('Password resetting completed. You can now login with your new password.')
            },
        }),

        verifyEmail: build.mutation<User, string>({
            query: (token) => `/auth/email_verification/${token}`,
            onQueryStarted: async (_, api) => {
                await api.queryFulfilled
                toast.success('Email verified. You can now login.')
            },
        }),

        resendVerificationLink: build.mutation<void, string>({
            query: (email) => ({
                url: `/auth/email_verification/resend`,
                method: 'POST',
                body: { email },
            }),
            onQueryStarted: async (arg, api) => {
                await api.queryFulfilled
                toast.success(`Email verification link has sent to ${arg}`)
            },
        }),

        logout: build.query<void, void>({
            query: () => ({
                url: `/auth/logout`,
                credentials: 'include',
            }),
            onQueryStarted: async (_, api) => {
                await api.queryFulfilled
                toast.success('Logged out.')
                api.dispatch(userLoggedOut())
                removeCookie('accessToken')
            },
        }),
    }),
})

export const {
    useSignupMutation,
    useLoginMutation,
    useLoginWithGoogleMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyEmailMutation,
    useResendVerificationLinkMutation,
    useLazyLogoutQuery,
} = authApi
