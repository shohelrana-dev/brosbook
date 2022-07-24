import { AnyAction, configureStore }       from '@reduxjs/toolkit'
import rootReducer                         from "@store/rootReducer"
import thunk                               from "redux-thunk"
import { appApi }                          from "@services/appApi"
import { Context, createWrapper, HYDRATE } from "next-redux-wrapper"

const reducer = ( state: any, action: AnyAction ) => {
    if( action.type === HYDRATE ){
        return { ...state, ...action.payload }
    } else{
        return rootReducer( state, action )
    }
}


// creating the store
const makeStore = ( context: Context ) => {
    return configureStore( {
        reducer: reducer,
        middleware: [thunk, appApi.middleware],
        devTools: process.env.NODE_ENV !== "production"
    } )
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>

export const wrapper = createWrapper<AppStore>( makeStore, { debug: false } )