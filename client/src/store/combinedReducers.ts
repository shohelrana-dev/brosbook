import { combineReducers } from '@reduxjs/toolkit'
import { authSlice }       from '@features/authSlice'
import { baseApi }         from "@services/baseApi"
import { hydrateSlice }    from "@features/hydrateSlice"

const combinedReducers = combineReducers( {
    [hydrateSlice.name]: hydrateSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer
} )

export default combinedReducers