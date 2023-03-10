import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from "@services/baseApi"
import { authSlice } from "@slices/authSlice"

export const store = configureStore( {
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [authSlice.name]: authSlice.reducer
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: ( getDefault ) => getDefault().concat( baseApi.middleware )
} )


// Infer the `RootState` and `AppDispatch` interfaces from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
