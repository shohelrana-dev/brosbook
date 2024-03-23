import { Middleware, MiddlewareAPI, configureStore, isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'sonner'
import { baseApi } from '~/services/baseApi'
import { authSlice } from '~/slices/authSlice'
import { socketSlice } from '~/slices/socketSlice'
import { toggleCommentsSlice } from '~/slices/toggleCommentsSlice'

/**
 * Show toast middleware
 */
const mutationErrorToastMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const arg = action.meta.arg
        const isMutation = arg && typeof arg === 'object' && 'type' in arg && arg.type === 'mutation'
        if (isMutation) {
            const payload = action.payload as any
            let errorMessage
            if (payload?.data?.message) errorMessage = payload?.data?.message
            else if (!navigator.onLine)
                errorMessage = 'Network error! Please chack your internet connection.'
            else errorMessage = payload?.error || null

            if (errorMessage) toast.error(errorMessage)
        }
    }

    return next(action)
}

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [authSlice.name]: authSlice.reducer,
        [socketSlice.name]: socketSlice.reducer,
        [toggleCommentsSlice.name]: toggleCommentsSlice.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefault) =>
        getDefault({ serializableCheck: false }).concat([
            baseApi.middleware,
            mutationErrorToastMiddleware,
        ]),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
