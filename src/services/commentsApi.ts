import { ListResponse } from "@interfaces/index.interfaces"
import { Comment }      from "@interfaces/posts.interfaces"
import { baseApi }      from "@services/baseApi"

export const commentsApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getComments: build.query<ListResponse<Comment>, { postId: string, page: number, limit?: number }>( {
            query: ( { postId, ...params } ) => ( {
                url: `posts/${ postId }/comments`,
                params
            } ),
            providesTags: ['Comment']
        } ),

        createComment: build.mutation<Comment, { postId: string, body: string }>( {
            query: ( { postId, ...formData } ) => ( {
                url: `posts/${ postId }/comments`,
                method: 'POST',
                body: formData
            } ),
            invalidatesTags: ['Comment']
        } ),

        likeComment: build.mutation<Comment, { postId: string, commentId: string }>( {
            query: ( { postId, commentId } ) => ( {
                url: `posts/${ postId }/comments/${ commentId }/like`,
                method: 'POST'
            } ),
            invalidatesTags: ['Comment']
        } ),

        unlikeComment: build.mutation<Comment, { postId: string, commentId: string }>( {
            query: ( { postId, commentId } ) => ( {
                url: `posts/${ postId }/comments/${ commentId }/unlike`,
                method: 'POST'
            } ),
            invalidatesTags: ['Comment']
        } ),
    } ),
} )

export const {
                 useGetCommentsQuery,
                 useCreateCommentMutation,
                 useLikeCommentMutation,
                 useUnlikeCommentMutation
             } = commentsApi