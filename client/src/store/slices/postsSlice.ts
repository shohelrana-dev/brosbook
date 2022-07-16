import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Post, PostsState }           from "@interfaces/posts.interfaces"
import { PaginateMeta }               from "@interfaces/index.interfaces"
import { RootState }                  from "@store/index";

const initialState: PostsState = {
    isLoadingPosts: false,
    isUpdatingPost: false,
    posts: [],
    postsMeta: <PaginateMeta>{}
}

export const postsSlice = createSlice( {
    name: 'posts',
    initialState,
    reducers: {
        setLoading: ( state, { payload }: PayloadAction<'posts' | 'update_post'> ) => {
            switch ( payload ) {
                case 'posts':
                    state.isLoadingPosts = true
                    break
            }
        },
        setPostsData: ( state, { payload }: PayloadAction<{ posts: Post[], meta: PaginateMeta }> ) => {
            state.posts          = [ ...state.posts, ...payload.posts ]
            state.postsMeta      = payload.meta
            state.isLoadingPosts = false
        }
    }
} )

export const selectPosts = ( state: RootState ) => state.posts

export const { setLoading, setPostsData } = postsSlice.actions