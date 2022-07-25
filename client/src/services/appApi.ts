import { createApi }      from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react"
import { HYDRATE }        from "next-redux-wrapper"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL

export const appApi = createApi( {
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery( {
        baseUrl: BASE_URL,
        credentials: 'include'
    } ),
    extractRehydrationInfo( action, { reducerPath } ){
        if( action.type === HYDRATE ){
            return action.payload[reducerPath]
        }
    },
    endpoints: () => ( {} )
} )