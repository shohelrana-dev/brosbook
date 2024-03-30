import { toast } from 'sonner'
import { POSTS_PER_PAGE } from '~/config/constants'
import { ListResponse } from '~/interfaces/index.interfaces'
import { Post } from '~/interfaces/posts.interfaces'
import listQueryExtraDefinitions from '~/lib/listQueryExtraDefinitions'
import { baseApi } from '~/services/baseApi'

export const postsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getFeedPosts: build.query<ListResponse<Post>, number>({
            query: (page) => ({
                url: 'posts/feed',
                params: { page, limit: POSTS_PER_PAGE },
            }),
            keepUnusedDataFor: 30,
            ...listQueryExtraDefinitions,
        }),

        getPosts: build.query<ListResponse<Post>, { authorId?: string; page: number }>({
            query: (params) => ({
                url: 'posts',
                params: { ...params, limit: POSTS_PER_PAGE },
            }),
            ...listQueryExtraDefinitions,
        }),

        getPostById: build.query<Post, string>({
            query: (postId) => ({
                url: `posts/${postId}`,
            }),
        }),

        createPost: build.mutation<Post, FormData>({
            query: (data) => ({
                url: 'posts',
                method: 'POST',
                body: data,
            }),
            onQueryStarted: async (arg, api) => {
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Creating Post...',
                    error: (err) => err.error?.data?.message,
                    success: ({ data }) => {
                        api.dispatch(
                            postsApi.util.updateQueryData(
                                'getPosts',
                                { authorId: data.author.id } as any,
                                (draft: ListResponse<Post>) => {
                                    draft.items.unshift(data)
                                }
                            )
                        )
                        return 'Post created'
                    },
                })
            },
        }),

        deletePost: build.mutation<Post, string>({
            query: (id) => ({
                url: `posts/${id}`,
                method: 'DELETE',
            }),
            onQueryStarted: async (arg, api) => {
                toast.promise(() => api.queryFulfilled, {
                    loading: 'Deleting Post...',
                    error: (err) => err.error?.data?.message,
                    success: ({ data }) => {
                        //remove post from cache
                        api.dispatch(
                            postsApi.util.updateQueryData(
                                'getPosts',
                                { authorId: data.author.id } as any,
                                (draft: ListResponse<Post>) => {
                                    draft.items = draft.items.filter((post) => post.id !== arg)
                                }
                            )
                        )
                        return 'Post deleted'
                    },
                })
            },
        }),

        postLike: build.mutation<Post, { postId: string; authorId: string }>({
            query: ({ postId }) => ({
                url: `posts/${postId}/like`,
                method: 'POST',
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                function findAndLike(draft: ListResponse<Post>) {
                    const post = draft.items.find((p) => p.id === arg.postId)
                    if (post) {
                        post.likesCount += 1
                        post.isViewerLiked = true
                    }
                }

                // optimistic cache update
                const patchResult1 = dispatch(
                    postsApi.util.updateQueryData('getFeedPosts', undefined as any, findAndLike)
                )
                const patchResult2 = dispatch(
                    postsApi.util.updateQueryData(
                        'getPosts',
                        { authorId: arg.authorId } as any,
                        findAndLike
                    )
                )
                const patchResult3 = dispatch(
                    postsApi.util.updateQueryData('getPostById', arg.postId, (draft: Post) => {
                        draft.likesCount += 1
                        draft.isViewerLiked = true
                    })
                )

                try {
                    await queryFulfilled
                    await new Promise((resolve) => setTimeout(() => resolve(true), 4000))
                } catch (err) {
                    patchResult1.undo()
                    patchResult2.undo()
                    patchResult3.undo()
                    throw err
                }
            },
        }),

        postUnlike: build.mutation<Post, { postId: string; authorId: string }>({
            query: ({ postId }) => ({
                url: `posts/${postId}/unlike`,
                method: 'POST',
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                function findAndUnLike(draft: ListResponse<Post>) {
                    const post = draft.items.find((p) => p.id === arg.postId)
                    if (post) {
                        post.likesCount -= 1
                        post.isViewerLiked = false
                    }
                }

                // optimistic cache update
                const patchResult1 = dispatch(
                    postsApi.util.updateQueryData('getFeedPosts', undefined as any, findAndUnLike)
                )
                const patchResult2 = dispatch(
                    postsApi.util.updateQueryData(
                        'getPosts',
                        { authorId: arg.authorId } as any,
                        findAndUnLike
                    )
                )
                const patchResult3 = dispatch(
                    postsApi.util.updateQueryData('getPostById', arg.postId, (draft: Post) => {
                        draft.likesCount -= 1
                        draft.isViewerLiked = false
                    })
                )

                try {
                    await queryFulfilled
                } catch (err) {
                    patchResult1.undo()
                    patchResult2.undo()
                    patchResult3.undo()
                    throw err
                }
            },
        }),
    }),
})

export const {
    useGetFeedPostsQuery,
    useGetPostsQuery,
    useGetPostByIdQuery,
    useCreatePostMutation,
    useDeletePostMutation,
    usePostLikeMutation,
    usePostUnlikeMutation,
} = postsApi
