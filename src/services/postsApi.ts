import { Post } from "@interfaces/posts.interfaces"
import { baseApi } from "@services/baseApi"
import { ListResponse } from "@interfaces/index.interfaces"

export const postsApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getFeedPosts: build.query<ListResponse<Post>, { page: number, limit?: number }>( {
            query: ( params ) => ( {
                url: 'posts/feed',
                params
            } ),
            providesTags: ['Post']
        } ),

        getPosts: build.query<ListResponse<Post>, { userId?: string, page?: number, limit?: number }>( {
            query: ( params ) => ( {
                url: 'posts',
                params
            } ),
            providesTags: ['Post']
        } ),

        getPostById: build.query<Post, string>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }`
            } ),
            providesTags: ['Post']
        } ),

        createPost: build.mutation<Post, FormData>( {
            query: ( formData ) => ( {
                url: 'posts',
                method: 'POST',
                body: formData
            } ),
            invalidatesTags: ['Post']
        } ),

        deletePost: build.mutation<Post, string>( {
            query: ( id ) => ( {
                url: `posts/${ id }`,
                method: 'DELETE'
            } ),
            invalidatesTags: ['Post']
        } ),

        postLike: build.mutation<Post, string>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/like`,
                method: 'POST'
            } ),
            invalidatesTags: ['Post']
        } ),

        postUnlike: build.mutation<Post, string>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/unlike`,
                method: 'POST'
            } ),
            invalidatesTags: ['Post']
        } ),
    } ),
} )

export const {
                 useGetFeedPostsQuery,
                 useGetPostsQuery,
                 useGetPostByIdQuery,
                 useCreatePostMutation,
                 useDeletePostMutation,
                 usePostLikeMutation,
                 usePostUnlikeMutation
             } = postsApi