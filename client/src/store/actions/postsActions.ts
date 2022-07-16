import { Dispatch } from "redux"

import api       from "../../api/index"
import { toast } from "react-toastify"
import { setLoading, setPostsData } from "@slices/postsSlice"

export const createPost = async ( content: string, image: Blob ) => {
    try {
        const formData = new FormData()
        formData.append( 'image', image )
        formData.append( 'content', content )

        //api call
        const { data } = await api.posts.createPost( formData )

        //show success message
        toast.success( data.message )

    } catch ( err: any ) {
        const message = err?.response?.data.message || ''
        //show error message
        toast.success( message )
    }
}

export const fetchPostsAction = ( page: number, postsPerPage?: number ) => async ( dispatch: Dispatch ) => {
    dispatch( setLoading( 'posts' ) )

    try {
        //api call
        const { data } = await api.posts.fetchPosts( page, postsPerPage )

        //set posts on state
        dispatch( setPostsData( data ) )
    } catch ( err: any ) {
        const message = err?.response?.data.message || ''
        //console error message
        console.error( message )
    }
}