import { configureStore }                                 from '@reduxjs/toolkit'
import rootReducer                                        from "@store/rootReducer"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

export const store = configureStore( {
    reducer: rootReducer,
    middleware: ( getDefaultMiddleware ) => getDefaultMiddleware( {
        serializableCheck: false
    } ),
    devTools: process.env.NODE_ENV !== "production"

} )

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch                                  = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector