import { Post }         from "@interfaces/posts.interfaces"
import { baseApi }      from "@services/baseApi";
import { ListResponse } from "@interfaces/index.interfaces"

export const postsApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getFeedPosts: build.query<ListResponse<Post>, { page: number, limit?: number }>( {
            query: ( params ) => ( {
                url: 'posts/feed',
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

        postLike: build.mutation<Post, number>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/like`,
                method: 'POST'
            } ),
        } ),

        postUnlike: build.mutation<Post, number>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/unlike`,
                method: 'POST'
            } ),
        } ),
    } ),
} )

export const { useGetFeedPostsQuery, useCreatePostMutation, usePostLikeMutation, usePostUnlikeMutation } = postsApi