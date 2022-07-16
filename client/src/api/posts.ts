import API from "@utils/API"

const postsApi = {
    fetchPosts: ( page: number, limit?: number ) => API.get( `/posts`, {
        params: { page, limit }
    } ),
    createPost: ( data: FormData ) => API.post( `/posts`, data, { headers: { 'Content-Type': 'multipart/form-data' } } ),
    savePostLike: ( postId: number ) => API.post( `/posts/${ postId }/likes` ),
    removePostLike: ( postId: number ) => API.delete( `/posts/${ postId }/likes` ),
}

export default postsApi