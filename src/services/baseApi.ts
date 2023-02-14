import { createApi } from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react"
import { RootState } from "../store"
import { getCookie } from "tiny-cookie"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL

export const baseApi = createApi( {
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery( {
        baseUrl: BASE_URL,
        credentials: "include",
        prepareHeaders: ( headers, { getState } ) => {
            const token = getCookie( 'access_token' ) || ( getState() as RootState )?.auth?.access_token
            if( token ){
                headers.set( 'Authorization', `Bearer ${ token }` )
            }
            return headers
        }
    } ),
    tagTypes: ['Post', 'User', 'Conversation', 'Message', 'Comment', 'Notification', 'Media'],
    endpoints: () => ( {} )
} )