import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '~/services/baseApi'
import { authSlice } from '~/slices/authSlice'
import { socketSlice } from '~/slices/socketSlice'
import { toggleCommentsSlice } from '~/slices/toggleCommentsSlice'

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [authSlice.name]: authSlice.reducer,
        [socketSlice.name]: socketSlice.reducer,
        [toggleCommentsSlice.name]: toggleCommentsSlice.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefault) => getDefault({ serializableCheck: false }).concat([baseApi.middleware]),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
