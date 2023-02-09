import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authSlice } from "@slices/authSlice"
import { baseApi } from "@services/baseApi"

export const store = configureStore( {
    reducer: combineReducers( {
        [baseApi.reducerPath]: baseApi.reducer,
        [authSlice.name]: authSlice.reducer
    } ),
    devTools: process.env.NODE_ENV !== 'production',
    middleware: ( getDefaultMiddleware ) => getDefaultMiddleware( {} ).concat( [baseApi.middleware] ),
} )

// Infer the `RootState` and `AppDispatch` interfaces from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
