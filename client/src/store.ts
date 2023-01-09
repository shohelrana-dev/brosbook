import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authSlice } from "@slices/authSlice"
import { baseApi } from "@services/baseApi"
import { chatSlice } from "@slices/chatSlice";

export const store = configureStore( {
    reducer: combineReducers( {
        [authSlice.name]: authSlice.reducer,
        [chatSlice.name]: chatSlice.reducer,
        [baseApi.reducerPath]: baseApi.reducer
    } ),
    devTools: process.env.NODE_ENV !== 'production',
    middleware: ( getDefaultMiddleware ) => getDefaultMiddleware( {} ).concat( [baseApi.middleware] ),
} )

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
