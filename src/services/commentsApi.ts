import { toast } from 'sonner'
import { ListResponse } from '~/interfaces/index.interfaces'
import { Comment } from '~/interfaces/posts.interfaces'
import { baseApi } from '~/services/baseApi'
import { RootState } from '~/store'
import { COMMENTS_PER_PAGE } from '~/utils/constants'
import listQueryExtraDefinitions from '~/utils/listQueryExtraDefinitions'

export const commentsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getComments: build.query<ListResponse<Comment>, { postId: string; page: number }>({
            query: ({ postId, page }) => ({
                url: `posts/${postId}/comments`,
                params: { page, limit: COMMENTS_PER_PAGE },
            }),
            providesTags: (result, error, arg) => [{ type: 'Comments', id: arg.postId }],
            ...listQueryExtraDefinitions,
        }),

        createComment: build.mutation<Comment, { postId: string; body: string }>({
            query: ({ postId, ...formData }) => ({
                url: `posts/${postId}/comments`,
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Comments', id: arg.postId }],
            onQueryStarted: async (arg, api) => {
                // optimistic cache update
                const currentUser = (api.getState() as RootState).session.user
                const patchResult = api.dispatch(
                    commentsApi.util.updateQueryData(
                        'getComments',
                        { postId: arg.postId } as any,
                        (draft: ListResponse<Comment>) => {
                            const newComment: Comment = {
                                ...arg,
                                id: Date.now().toString(),
                                likesCount: 0,
                                isViewerLiked: false,
                                author: currentUser!,
                                username: currentUser?.username!,
                                updatedAt: new Date().toISOString(),
                                createdAt: new Date().toISOString(),
                            }
                            draft.items.unshift(newComment)
                        }
                    )
                )

                toast.promise(() => api.queryFulfilled, {
                    loading: 'Creating comment...',
                    success: 'Comment created.',
                    error: (err) => {
                        patchResult.undo()
                        return err.error?.data?.message
                    },
                })
            },
        }),

        deleteComment: build.mutation<Comment, { postId: string; commentId: string }>({
            query: ({ postId, commentId }) => ({
                url: `posts/${postId}/comments/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Comments', id: arg.postId }],
            onQueryStarted: async (arg, api) => {
                //optimistic cache update
                const patchResult = api.dispatch(
                    commentsApi.util.updateQueryData(
                        'getComments',
                        { postId: arg.postId } as any,
                        (draft: ListResponse<Comment>) => {
                            draft.items = draft.items.filter((c) => c.id !== arg.commentId)
                        }
                    )
                )

                toast.promise(() => api.queryFulfilled, {
                    loading: 'Deleting comment...',
                    success: 'Comment deleted.',
                    error: (err) => {
                        patchResult.undo()
                        return err.error?.data?.message
                    },
                })
            },
        }),

        likeComment: build.mutation<Comment, { postId: string; commentId: string }>({
            query: ({ postId, commentId }) => ({
                url: `posts/${postId}/comments/${commentId}/like`,
                method: 'POST',
            }),
            onQueryStarted: async (arg, api) => {
                // optimistic cache update
                const patchResult = api.dispatch(
                    commentsApi.util.updateQueryData(
                        'getComments',
                        { postId: arg.postId } as any,
                        (draft: ListResponse<Comment>) => {
                            const comment = draft.items.find((c) => c.id === arg.commentId)
                            if (comment) {
                                comment.likesCount += 1
                                comment.isViewerLiked = true
                            }
                        }
                    )
                )

                try {
                    await api.queryFulfilled
                } catch (err) {
                    patchResult.undo()
                    throw err
                }
            },
        }),

        unlikeComment: build.mutation<Comment, { postId: string; commentId: string }>({
            query: ({ postId, commentId }) => ({
                url: `posts/${postId}/comments/${commentId}/unlike`,
                method: 'POST',
            }),
            onQueryStarted: async (arg, api) => {
                // optimistic cache update
                const patchResult = api.dispatch(
                    commentsApi.util.updateQueryData(
                        'getComments',
                        { postId: arg.postId } as any,
                        (draft: ListResponse<Comment>) => {
                            const comment = draft.items.find((c) => c.id === arg.commentId)
                            if (comment) {
                                comment.likesCount -= 1
                                comment.isViewerLiked = false
                            }
                        }
                    )
                )

                try {
                    await api.queryFulfilled
                } catch (err) {
                    patchResult.undo()
                    throw err
                }
            },
        }),
    }),
})

export const {
    useGetCommentsQuery,
    useCreateCommentMutation,
    useDeleteCommentMutation,
    useLikeCommentMutation,
    useUnlikeCommentMutation,
} = commentsApi
