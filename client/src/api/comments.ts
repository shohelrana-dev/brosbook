import API from "@utils/API"

const commentsApi = {
    fetchComments: ( postId: number, page: number, limit?: number ) => API.get( `/posts/${ postId }/comments`, {
        params: { page, limit }
    } ),
    saveComment: ( content: string, postId: number ) => API.post( `/posts/${ postId }/comments`, { content } ),
    saveCommentLike: ( postId: number, commentId: number ) => API.post( `/posts/${ postId }/comments/${ commentId }/likes` ),
    removeCommentLike: ( postId: number, commentId: number ) => API.delete( `/posts/${ postId }/comments/${ commentId }/likes` )
}

export default commentsApi