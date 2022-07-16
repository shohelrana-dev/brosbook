import { combineReducers } from '@reduxjs/toolkit'
import { authSlice }       from '@slices/authSlice'
import { chatSlice }       from "@slices/chatSlice"
import { settingsSlice }   from "@slices/settingsSlice"
import { postsSlice }      from "@slices/postsSlice"
import { profileSlice } from "@slices/profileSlice"

const rootReducer = combineReducers( {
    auth: authSlice.reducer,
    chat: chatSlice.reducer,
    settings: settingsSlice.reducer,
    posts: postsSlice.reducer,
    profile: profileSlice.reducer,
} )

export default rootReducer