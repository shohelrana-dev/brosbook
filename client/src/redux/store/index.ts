import { configureStore } from '@reduxjs/toolkit'
import rootReducer        from "@store/rootReducer"

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware()],
    devTools: process.env.NODE_ENV !== "production"

})

export type RootState = ReturnType<typeof store.getState>