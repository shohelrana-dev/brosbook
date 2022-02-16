import { Dispatch } from "redux"
import api          from "@api/index"
import {
    startLoadingPosts,
    startLoadingUser,
    setUser,
    setPostsData,
    setFollowersData,
    setFollowingData,
    startLoadingFollowing,
    startLoadingFollowers,
    clearData
}                   from "@slices/profileSlice"

export const fetchUserAction = ( username: string ) => async ( dispatch: Dispatch ) => {
    dispatch( startLoadingUser() )

    try {
        //api call
        const { data } = await api.profile.fetchUser( username )

        //set posts on state
        dispatch( setUser( data.user ) )
    } catch ( err: any ) {
        //console error message
        console.error( err.response?.data?.message )
    }
}

export const fetchPostsAction = ( username: string, page: number, postsPerPage?: number ) => async ( dispatch: Dispatch ) => {
    dispatch( startLoadingPosts() )

    try {
        //api call
        const { data } = await api.profile.fetchPosts( username, page, postsPerPage )

        //set posts on state
        dispatch( setPostsData( data ) )
    } catch ( err: any ) {
        //console error message
        console.error( err.response?.data?.message )
    }
}

export const clearDataAction = () => async ( dispatch: Dispatch ) => {
    dispatch( clearData() )
}

export const fetchFollowersAction = ( username: string, page: number, postsPerPage?: number ) => async ( dispatch: Dispatch ) => {
    dispatch( startLoadingFollowers() )

    try {
        //api call
        const { data } = await api.profile.fetchFollowers( username, page, postsPerPage )

        //set posts on state
        dispatch( setFollowersData( data ) )
    } catch ( err: any ) {
        //console error message
        console.error( err.response?.data?.message )
    }
}

export const fetchFollowingAction = ( username: string, page: number, postsPerPage?: number ) => async ( dispatch: Dispatch ) => {
    dispatch( startLoadingFollowing() )

    try {
        //api call
        const { data } = await api.profile.fetchFollowing( username, page, postsPerPage )

        //set posts on state
        dispatch( setFollowingData( data ) )
    } catch ( err: any ) {
        //console error message
        console.error( err.response?.data?.message )
    }
}