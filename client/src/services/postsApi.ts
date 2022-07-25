import { Post }    from "@interfaces/posts.interfaces"
import { authApi } from "@services/authApi"

type FetchData = {
    message: string
    success: boolean
    posts?: Post[]
    post?: Post,
    meta?: {
        count: number
        currentPage: number
        lastPage: number
        nextPage: number | null
        prevPage: number | null
    }
}

export const postsApi = authApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getPosts: build.query<FetchData, { page?: number, limit?: number }>( {
            query: () => 'posts'
        } ),

        createPost: build.mutation<FetchData, { content: string, image: Blob }>( {
            query: ( formData ) => ( {
                url: 'posts',
                method: 'POST',
                body: formData
            } ),
        } ),

        like: build.mutation<FetchData, number>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/like`,
                method: 'POST'
            } ),
        } ),

        unlike: build.mutation<FetchData, number>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/unlike`,
                method: 'POST'
            } ),
        } ),
    } ),
} )

export const { useGetPostsQuery, useCreatePostMutation, useLikeMutation, useUnlikeMutation } = postsApi