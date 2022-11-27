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

        createPost: build.mutation<Post, FormData>( {
            query: ( formData ) => ( {
                url: 'posts',
                method: 'POST',
                body: formData
            } ),
        } ),

        deletePost: build.mutation<Post, string>( {
            query: ( id ) => ( {
                url: `posts/${id}`,
                method: 'DELETE'
            } ),
        } ),

        postLike: build.mutation<Post, string>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/like`,
                method: 'POST'
            } ),
        } ),

        postUnlike: build.mutation<Post, string>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/unlike`,
                method: 'POST'
            } ),
        } ),
    } ),
} )

export const { useGetFeedPostsQuery, useCreatePostMutation, useDeletePostMutation, usePostLikeMutation, usePostUnlikeMutation } = postsApi