import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '~/services/baseApi'
import { sessionSlice } from '~/slices/sessionSlice'
import { socketSlice } from '~/slices/socketSlice'
import { toggleCommentsSlice } from '~/slices/toggleCommentsSlice'

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [sessionSlice.name]: sessionSlice.reducer,
        [socketSlice.name]: socketSlice.reducer,
        [toggleCommentsSlice.name]: toggleCommentsSlice.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefault) => getDefault({ serializableCheck: false }).concat([baseApi.middleware]),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
