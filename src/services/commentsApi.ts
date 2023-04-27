import { ListResponse } from "@interfaces/index.interfaces"
import { Comment } from "@interfaces/posts.interfaces"
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
            providesTags: ['Comments'],
            ...listQueryExtraDefinitions
        } ),

        createComment: build.mutation<Comment, { postId: string, body: string }>( {
            query: ( { postId, ...formData } ) => ( {
                url: `posts/${ postId }/comments`,
                method: 'POST',
                body: formData
            } ),
            invalidatesTags: ['Comments']
        } ),

        deleteComment: build.mutation<Comment, { postId: string, commentId: string }>( {
            query: ( { postId, commentId } ) => ( {
                url: `posts/${ postId }/comments/${ commentId }`,
                method: 'DELETE'
            } ),
            invalidatesTags: ['Comments']
        } ),

        likeComment: build.mutation<Comment, { postId: string, commentId: string }>( {
            query: ( { postId, commentId } ) => ( {
                url: `posts/${ postId }/comments/${ commentId }/like`,
                method: 'POST'
            } ),
            invalidatesTags: ['Comments']
        } ),

        unlikeComment: build.mutation<Comment, { postId: string, commentId: string }>( {
            query: ( { postId, commentId } ) => ( {
                url: `posts/${ postId }/comments/${ commentId }/unlike`,
                method: 'POST'
            } ),
            invalidatesTags: ['Comments']
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