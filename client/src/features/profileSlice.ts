import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Post }                       from "@interfaces/posts.interfaces"
import { PaginateMeta, ProfileState } from "@interfaces/index.interfaces"
import { User }      from "@interfaces/user.interfaces"
import { RootState } from "@store/store";

const initialState: ProfileState = {
    isLoadingUser: false,
    isLoadingPosts: false,
    isLoadingFollowers: false,
    isLoadingFollowing: false,
    user: {} as User,
    posts: [],
    followers: [],
    following: [],
    postsMeta: {} as PaginateMeta,
    followersMeta: {} as PaginateMeta,
    followingMeta: {} as PaginateMeta
}

export const profileSlice = createSlice( {
    name: 'profile',
    initialState,
    reducers: {
        startLoadingPosts: ( state, { payload }: PayloadAction<void> ) => {
            state.isLoadingPosts = true
        },
        startLoadingUser: ( state, { payload }: PayloadAction<void> ) => {
            state.isLoadingUser = true
        },
        startLoadingFollowers: ( state, { payload }: PayloadAction<void> ) => {
            state.isLoadingFollowers = true
        },
        startLoadingFollowing: ( state, { payload }: PayloadAction<void> ) => {
            state.isLoadingFollowing = true
        },
        setUser: ( state, { payload }: PayloadAction<User> ) => {
            state.user          = payload
            state.isLoadingUser = false
        },
        setPostsData: ( state, { payload }: PayloadAction<{ posts: Post[], meta: PaginateMeta }> ) => {
            state.posts          = [ ...state.posts, ...payload.posts ]
            state.postsMeta      = payload.meta
            state.isLoadingPosts = false
        },
        setFollowersData: ( state, { payload }: PayloadAction<{ followers: User[], meta: PaginateMeta }> ) => {
            state.followers          = [ ...state.followers, ...payload.followers ]
            state.followersMeta      = payload.meta
            state.isLoadingFollowers = false
        },
        setFollowingData: ( state, { payload }: PayloadAction<{ following: User[], meta: PaginateMeta }> ) => {
            state.following          = [ ...state.following, ...payload.following ]
            state.followingMeta      = payload.meta
            state.isLoadingFollowing = false
        },
        clearData: ( state, { payload }: PayloadAction<void> ) => {
            state.posts     = []
            state.postsMeta = {} as PaginateMeta
        }
    }
} )

export const selectProfile = ( state: RootState ) => state.profile

export const {
                 startLoadingUser,
                 startLoadingPosts,
                 startLoadingFollowers,
                 startLoadingFollowing,
                 setUser,
                 setPostsData,
                 setFollowersData,
                 setFollowingData,
                 clearData
             } = profileSlice.actions