import { ListResponse } from "@interfaces/index.interfaces"
import { Comment }      from "@interfaces/posts.interfaces"
import { baseApi }      from "@services/baseApi"

export const commentsApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getComments: build.query<ListResponse<Comment>, { postId: string, page: number, limit?: number }>( {
            query: ( { postId, ...params } ) => ( {
                url: `posts/${ postId }/comments`,
                params
            } )
        } ),

        createComment: build.mutation<Comment, { postId: string, body: string }>( {
            query: ( { postId, ...formData } ) => ( {
                url: `posts/${ postId }/comments`,
                method: 'POST',
                body: formData
            } ),
        } ),

        likeComment: build.mutation<Comment, { postId: string, commentId: number }>( {
            query: ( { postId, commentId } ) => ( {
                url: `posts/${ postId }/comments/${ commentId }/like`,
                method: 'POST'
            } ),
        } ),

        unlikeComment: build.mutation<Comment, { postId: string, commentId: number }>( {
            query: ( { postId, commentId } ) => ( {
                url: `posts/${ postId }/comments/${ commentId }/unlike`,
                method: 'POST'
            } ),
        } ),
    } ),
} )

export const {
                 useGetCommentsQuery,
                 useCreateCommentMutation,
                 useLikeCommentMutation,
                 useUnlikeCommentMutation
             } = commentsApi