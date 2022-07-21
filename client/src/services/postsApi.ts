import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post }                      from "@interfaces/posts.interfaces"

const baseUrl = `${ process.env.NEXT_PUBLIC_SERVER_API_URL }/posts`

type FetchData = {
    message: string
    success: boolean
    posts?: Post[]
    post?: Post
}

export const postsApi = createApi( {
    reducerPath: 'postsApi',
    baseQuery: fetchBaseQuery( { baseUrl } ),
    endpoints: ( build ) => ( {
        getPosts: build.query<FetchData, { page: number }>( {
            query: () => ( {
                url: '/',
                credentials: 'include'
            } ),
        } ),
        createPost: build.mutation<FetchData, { content: string, image: Blob }>( {
            query: ( formData ) => ( {
                url: '/',
                method: 'POST',
                body: formData,
                credentials: 'include'
            } ),
        } ),
    } ),
} )

export const { useGetPostsQuery, useCreatePostMutation } = postsApi