import { createApi }      from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react"
import { HYDRATE }        from "next-redux-wrapper"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL

export const appApi = createApi( {
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery( {
        baseUrl: BASE_URL,
        prepareHeaders: headers => {
            const access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiU2hvaGVsIiwibGFzdE5hbWUiOiJSYW5hIiwidXNlcm5hbWUiOiJzaG9oZWxyYW5hIiwiZW1haWwiOiJzaG9oZWxycnJhbmFAZ21haWwuY29tIiwicGhvdG8iOiJodHRwOi8vbG9jYWxob3N0OjQwMDAvaW1hZ2VzL2F2YXRhci5wbmciLCJpYXQiOjE2NTg2OTIyOTMsImV4cCI6MTY1ODY5NTg5M30._zb8s5xe1RFM50Fw619uDfERLwzNg7k-ln5H6eaBtGM'
            if( access_token ){
                headers.set( 'authorization', `Bearer ${ access_token }` )
            }
            return headers
        }
    } ),
    extractRehydrationInfo( action, { reducerPath } ){
        if( action.type === HYDRATE ){
            return action.payload[reducerPath]
        }
    },
    endpoints: () => ( {} ),
} )