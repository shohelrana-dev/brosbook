import { Post } from "@interfaces/posts.interfaces"
import { baseApi } from "@services/baseApi"
import { ListResponse } from "@interfaces/index.interfaces"
import listQueryExtraDefinitions from "@utils/listQueryExtraDefinitions"

const postsPerPage = process.env.NEXT_PUBLIC_POSTS_PER_PAGE

export const postsApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getFeedPosts: build.query<ListResponse<Post>, number>( {
            query: ( page ) => ( {
                url: 'posts/feed',
                params: { page, limit: postsPerPage }
            } ),
            providesTags: ['Post'],
            ...listQueryExtraDefinitions
        } ),

        getPosts: build.query<ListResponse<Post>, { userId?: string, page: number }>( {
            query: ( params ) => ( {
                url: 'posts',
                params: { ...params, limit: postsPerPage }
            } ),
            providesTags: ['Post'],
            ...listQueryExtraDefinitions
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