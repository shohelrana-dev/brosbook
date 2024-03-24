import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getCookie, setCookie } from 'tiny-cookie'
import { userLoggedOut } from '~/slices/authSlice'
import { clearSession } from '~/utils/session'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const token = getCookie('accessToken')

        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }

        return headers
    },
})

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: async (args, api, extraOptions) => {
        const result = await baseQuery(args, api, extraOptions)

        if (result?.error && result?.error?.status === 403) {
            // try to get a new token
            console.log('Requesting for new token...')
            const { data } = await baseQuery(
                { url: '/auth/refresh_token', credentials: 'include' },
                api,
                extraOptions
            )

            if (data && typeof data === 'object' && 'accessToken' in data) {
                console.log('New token generated.')
                setCookie('accessToken', data.accessToken)

                //retry the failed query
                return await baseQuery(args, api, extraOptions)
            } else {
                clearSession()
                api?.dispatch(userLoggedOut())
            }
        }

        return result
    },
    keepUnusedDataFor: 300,
    tagTypes: ['CurrentUser', 'User', 'Comments', 'Conversation', 'UserMedia', 'ConversationMedia'],
    endpoints: () => ({}),
})
