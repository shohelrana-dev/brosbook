import { AnyAction, configureStore }         from '@reduxjs/toolkit'
import combinedReducers                      from "@store/combinedReducers"
import { createWrapper, HYDRATE, MakeStore } from "next-redux-wrapper"
import { baseApi }                           from "@services/baseApi"

const reducer = ( state: any, action: AnyAction ): ReturnType<typeof combinedReducers> => {
    if( action.type === HYDRATE && ! state.isHydrate ){
        return { ...state, ...action.payload, isHydrate: true }
    } else{
        return combinedReducers( state, action )
    }
}


// creating the store
const makeStore = () => {
    return configureStore( {
        reducer: reducer,
        middleware: ( getDefaultMiddleware ) => getDefaultMiddleware().concat( baseApi.middleware ),
        devTools: process.env.NODE_ENV !== "production"
    } )
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>

export const wrapper = createWrapper<AppStore>( makeStore )
