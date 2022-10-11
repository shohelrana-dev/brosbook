import { createApi }      from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react"
import { HYDRATE }        from "next-redux-wrapper"
import Cookies            from "js-cookie"
import { RootState }      from "@store/store";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL

export const baseApi = createApi( {
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery( {
        baseUrl: BASE_URL,
        credentials: "include",
        prepareHeaders: ( headers, { getState } ) => {
            const token = Cookies.get( 'access_token' ) || ( getState() as RootState )?.auth?.access_token
            if( token ){
                headers.set( 'Authorization', `Bearer ${ token }` )
            }
            return headers
        }
    } ),
    extractRehydrationInfo( action, { reducerPath } ){
        if( action.type === HYDRATE ){
            return action.payload[reducerPath]
        }
    },
    endpoints: () => ( {} )
} )