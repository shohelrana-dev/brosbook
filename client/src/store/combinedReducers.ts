import { combineReducers } from '@reduxjs/toolkit'
import { authSlice }       from '@slices/authSlice'
import { baseApi }         from "@services/baseApi"
import { hydrateSlice }    from "@slices/hydrateSlice"

const combinedReducers = combineReducers( {
    [hydrateSlice.name]: hydrateSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer
} )

export default combinedReducers