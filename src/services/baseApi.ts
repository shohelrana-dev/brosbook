import { RootState } from '../store'
import { createApi } from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react"
import { getCookie, removeCookie } from "tiny-cookie"
import { userLoggedOut } from "@slices/authSlice"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL

const baseQuery = fetchBaseQuery( {
    baseUrl: BASE_URL,
    prepareHeaders: ( headers ) => {
        const token = getCookie( 'access_token' )

        if( token ){
            headers.set( 'Authorization', `Bearer ${ token }` )
        }

        return headers
    }
} )

export const baseApi = createApi( {
    reducerPath: 'baseApi',
    baseQuery: async( args, api, extraOptions ) => {
        const result = await baseQuery( args, api, extraOptions )
        const state  = api.getState() as RootState

        if( result?.error?.status === 401 && state.auth.isAuthenticated ){
            api?.dispatch( userLoggedOut() )
            removeCookie( 'access_token' )
        }

        return result
    },
    tagTypes: ['Post', 'User', 'Conversation', 'Message', 'Comment', 'Notification', 'Media'],
    endpoints: () => ( {} )
} )