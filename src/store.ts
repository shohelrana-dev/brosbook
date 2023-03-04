import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { authSlice } from "@slices/authSlice"
import { baseApi } from "@services/baseApi"
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: [authSlice.name]
}

const persistedReducer = persistReducer(persistConfig, combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    [authSlice.name]: authSlice.reducer
}))


export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat([baseApi.middleware]),
})

export const persistor = persistStore(store)


// Infer the `RootState` and `AppDispatch` interfaces from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
