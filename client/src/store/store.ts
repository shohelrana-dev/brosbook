import { configureStore }                                 from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import rootReducer                                        from "@store/rootReducer"
import { setupListeners }                                 from "@reduxjs/toolkit/query"
import thunk                                              from "redux-thunk"
import { appApi }                                         from "@services/appApi"

// creating the store
export const store = configureStore( {
    reducer: rootReducer,
    middleware: [thunk, appApi.middleware],
    devTools: process.env.NODE_ENV !== "production"
} )

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch                                  = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

setupListeners( store.dispatch )