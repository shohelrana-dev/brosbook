import { Post }    from "@interfaces/posts.interfaces"
import { authApi } from "@services/authApi"

type PostsResponse = {
    items: Post[]
    count: number
    currentPage: number
    lastPage: number
    nextPage: number | null
    prevPage: number | null
}

export const postsApi = authApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getPosts: build.query<PostsResponse, { page?: number, limit?: number }>( {
            query: ( params ) => ( {
                url: 'posts',
                params
            } )
        } ),

        createPost: build.mutation<Post, { content: string, image: Blob }>( {
            query: ( formData ) => ( {
                url: 'posts',
                method: 'POST',
                body: formData
            } ),
        } ),

        like: build.mutation<Post, number>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/like`,
                method: 'POST'
            } ),
        } ),

        unlike: build.mutation<Post, number>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/unlike`,
                method: 'POST'
            } ),
        } ),
    } ),
} )

export const { useGetPostsQuery, useCreatePostMutation, useLikeMutation, useUnlikeMutation } = postsApi