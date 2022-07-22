import { createApi }      from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL

export const appApi = createApi( {
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery( { baseUrl: BASE_URL } ),
    endpoints: () => ( {} )
} )