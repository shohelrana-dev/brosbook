import { toast } from 'sonner'
import {
    CredentialsPayload,
    LoginResponse,
    ResetPassPayload,
    SignupPayload,
} from '~/interfaces/auth.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { baseApi } from '~/services/baseApi'
import { userLoggedIn, userLoggedOut } from '~/slices/authSlice'
import { clearSession, setSession } from '~/utils/session'

export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        signup: build.mutation<User, SignupPayload>({
            query: (payload) => ({
                url: `/auth/signup`,
                method: 'POST',
                body: payload,
            }),
            onQueryStarted: async (_, api) => {
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Creating account...',
                    success: 'Account created. Check your email for a link to verify your account.',
                    error: (err) => err.error?.data?.message,
                })
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
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Logging in...',
                    error: (err) => err.error?.data?.message,
                    success: ({ data }) => {
                        const { user, accessToken } = data

                        setSession({ user, accessToken })
                        api.dispatch(baseApi.util.resetApiState())
                        api.dispatch(userLoggedIn(user))
                        return 'Logged in.'
                    },
                })
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
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Logging in...',
                    error: (err) => err.error?.data?.message,
                    success: ({ data }) => {
                        const { user, accessToken } = data

                        setSession({ user, accessToken })
                        api.dispatch(baseApi.util.resetApiState())
                        api.dispatch(userLoggedIn(user))
                        return 'Logged in.'
                    },
                })
            },
        }),

        forgotPassword: build.mutation<{ message: string }, { email: string }>({
            query: (payload) => ({
                url: `/auth/forgot_password`,
                method: 'POST',
                body: payload,
            }),
            onQueryStarted: async (_, api) => {
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Sending email...',
                    success: 'Check your email for a link to reset your password.',
                    error: (err) => err.error?.data?.message,
                })
            },
        }),

        resetPassword: build.mutation<{ message: string }, ResetPassPayload & { token: string }>({
            query: ({ token, ...payload }) => ({
                url: `/auth/reset_password/${token}`,
                method: 'POST',
                body: payload,
            }),
            onQueryStarted: async (_, api) => {
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Resetting password...',
                    success: 'Resetting password completed. You can now login with your new password.',
                    error: (err) => err.error?.data?.message,
                })
            },
        }),

        verifyEmail: build.mutation<User, string>({
            query: (token) => `/auth/email_verification/${token}`,
            onQueryStarted: async (_, api) => {
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Verifying email...',
                    success: 'Email verified. You can now login.',
                    error: (err) => err.error?.data?.message,
                })
            },
        }),

        resendVerificationLink: build.mutation<void, string>({
            query: (email) => ({
                url: `/auth/email_verification/resend`,
                method: 'POST',
                body: { email },
            }),
            onQueryStarted: async (arg, api) => {
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Resending email verification link...',
                    success: 'Email verification link has sent to ' + arg + '. Please check your email.',
                    error: (err) => err.error?.data?.message,
                })
            },
        }),

        logout: build.query<void, void>({
            query: () => ({
                url: `/auth/logout`,
                credentials: 'include',
            }),
            onQueryStarted: async (_, api) => {
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Logging out...',
                    error: (err) => err.error?.data?.message,
                    success: () => {
                        clearSession()
                        api.dispatch(userLoggedOut())
                        return 'Logged out.'
                    },
                })
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
