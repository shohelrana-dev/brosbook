import { combineReducers } from '@reduxjs/toolkit'
import { authSlice }       from '@features/authSlice'
import { authApi }         from "@services/authApi"
import { postsApi }        from "@services/postsApi"

const rootReducer = combineReducers( {
    auth: authSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
} )

export default rootReducer