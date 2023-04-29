// noinspection TypeScriptValidateJSTypes

import { ListResponse } from "@interfaces/index.interfaces"
import {Comment} from "@interfaces/posts.interfaces"
import { baseApi } from "@services/baseApi"
import listQueryExtraDefinitions from "@utils/listQueryExtraDefinitions"

const commentsPerPage = process.env.NEXT_PUBLIC_COMMENTS_PER_PAGE

export const commentsApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getComments: build.query<ListResponse<Comment>, { postId: string, page: number }>( {
            query: ( { postId, page } ) => ( {
                url: `posts/${ postId }/comments`,
                params: { page, limit: commentsPerPage }
            } ),
            providesTags: (result, error, arg) => [
                { type: 'Comments', id: arg.postId }
            ],
            ...listQueryExtraDefinitions
        } ),

        createComment: build.mutation<Comment, { postId: string, body: string }>( {
            query: ( { postId, ...formData } ) => ( {
                url: `posts/${ postId }/comments`,
                method: 'POST',
                body: formData
            } ),
            invalidatesTags: (result, error, arg) => [
                { type: 'Comments', id: arg.postId }
            ]
        } ),

        deleteComment: build.mutation<Comment, { postId: string, commentId: string }>( {
            query: ( { postId, commentId } ) => ( {
                url: `posts/${ postId }/comments/${ commentId }`,
                method: 'DELETE'
            } ),
            invalidatesTags: (result, error, arg) => [
                { type: 'Comments', id: arg.postId }
            ]
        } ),

        likeComment: build.mutation<Comment, { postId: string, commentId: string }>( {
            query: ( { postId, commentId } ) => ( {
                url: `posts/${ postId }/comments/${ commentId }/like`,
                method: 'POST'
            } ),
            onQueryStarted: async( arg, { dispatch, queryFulfilled, getState } ) => {
                // optimistic cache update
                const patchResult = dispatch( commentsApi.util.updateQueryData( "getComments", {postId: arg.postId} as any, (draft: ListResponse<Comment>) => {
                    const comment = draft.items.find( ( c ) => c.id === arg.commentId )
                    if( comment ){
                        comment.likesCount += 1
                        comment.isViewerLiked = true
                    }
                } ) )

                try {
                    await queryFulfilled
                } catch ( err ) {
                    patchResult.undo()
                    throw err
                }
            }
        } ),

        unlikeComment: build.mutation<Comment, { postId: string, commentId: string }>( {
            query: ( { postId, commentId } ) => ( {
                url: `posts/${ postId }/comments/${ commentId }/unlike`,
                method: 'POST'
            } ),
            onQueryStarted: async( arg, { dispatch, queryFulfilled, getState } ) => {
                // optimistic cache update
                const patchResult = dispatch( commentsApi.util.updateQueryData( "getComments", {postId: arg.postId} as any, (draft: ListResponse<Comment>) => {
                    const comment = draft.items.find( ( c ) => c.id === arg.commentId )
                    if( comment ){
                        comment.likesCount -= 1
                        comment.isViewerLiked = false
                    }
                } ) )

                try {
                    await queryFulfilled
                } catch ( err ) {
                    patchResult.undo()
                    throw err
                }
            }
        } ),
    } ),
} )

export const {
                 useGetCommentsQuery,
                 useCreateCommentMutation,
                 useDeleteCommentMutation,
                 useLikeCommentMutation,
                 useUnlikeCommentMutation
             } = commentsApi