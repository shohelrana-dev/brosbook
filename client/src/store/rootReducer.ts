import { combineReducers } from '@reduxjs/toolkit'
import { authSlice }       from '@features/authSlice'
import { appApi }          from "@services/appApi"

const rootReducer = combineReducers( {
    auth: authSlice.reducer,
    [appApi.reducerPath]: appApi.reducer,
} )

export default rootReducer