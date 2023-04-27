// noinspection TypeScriptValidateJSTypes

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
            keepUnusedDataFor: 30,
            ...listQueryExtraDefinitions
        } ),

        getPosts: build.query<ListResponse<Post>, { userId?: string, page: number }>( {
            query: ( params ) => ( {
                url: 'posts',
                params: { ...params, limit: postsPerPage }
            } ),
            ...listQueryExtraDefinitions
        } ),

        getPostById: build.query<Post, string>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }`
            } )
        } ),

        createPost: build.mutation<Post, FormData>( {
            query: ( data ) => ( {
                url: 'posts',
                method: 'POST',
                body: data
            } )
        } ),

        deletePost: build.mutation<Post, string>( {
            query: ( id ) => ( {
                url: `posts/${ id }`,
                method: 'DELETE'
            } ),
            onQueryStarted:async (arg, {dispatch, queryFulfilled})=> {
                try {
                    await queryFulfilled

                    dispatch( postsApi.util.updateQueryData( "getPosts", undefined as any,  (draft: ListResponse<Post> ) =>{
                        draft.items = draft.items.filter((post) => post.id !== arg)
                    } ) )
                }catch (e) {
                    console.log(e)
                }
            }
        } ),

        postLike: build.mutation<Post, string>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/like`,
                method: 'POST'
            } ),
            onQueryStarted: async( arg, { dispatch, queryFulfilled } ) => {
                function findAndLike( draft: ListResponse<Post> ){
                    const post = draft.items.find( ( p ) => p.id === arg )
                    if( post ){
                        post.likesCount += 1
                        post.isViewerLiked = true
                    }
                }

                // optimistic cache update
                const patchResult1 = dispatch( postsApi.util.updateQueryData( "getFeedPosts", undefined as any, findAndLike ) )
                const patchResult2 = dispatch( postsApi.util.updateQueryData( "getPosts", undefined as any, findAndLike ) )
                const patchResult3 = dispatch( postsApi.util.updateQueryData( "getPostById", arg, ( draft: Post ) => {
                    draft.likesCount += 1
                    draft.isViewerLiked = true
                } ) )

                try {
                    await queryFulfilled
                } catch ( err ) {
                    patchResult1.undo()
                    patchResult2.undo()
                    patchResult3.undo()
                    throw err
                }

            }
        } ),

        postUnlike: build.mutation<Post, string>( {
            query: ( postId ) => ( {
                url: `posts/${ postId }/unlike`,
                method: 'POST'
            } ),
            onQueryStarted: async( arg, { dispatch, queryFulfilled } ) => {
                function findAndUnLike( draft: ListResponse<Post> ){
                    const post = draft.items.find( ( p ) => p.id === arg )
                    if( post ){
                        post.likesCount -= 1
                        post.isViewerLiked = false
                    }
                }

                // optimistic cache update
                const patchResult1 = dispatch( postsApi.util.updateQueryData( 'getFeedPosts', undefined as any, findAndUnLike ) )
                const patchResult2 = dispatch( postsApi.util.updateQueryData( 'getPosts', undefined as any, findAndUnLike ) )
                const patchResult3 = dispatch( postsApi.util.updateQueryData( 'getPostById', arg, ( draft: Post ) => {
                    draft.likesCount -= 1
                    draft.isViewerLiked = false
                } ) )

                try {
                    await queryFulfilled
                } catch ( err ) {
                    patchResult1.undo()
                    patchResult2.undo()
                    patchResult3.undo()
                    throw err
                }
            }
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