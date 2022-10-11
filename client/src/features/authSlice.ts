import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState }                          from "@store/store"
import { User }                               from "@interfaces/user.interfaces"
import { authApi }                            from "@services/authApi"
import Cookies                                from "js-cookie"

interface AuthState {
    isAuthenticated: boolean
    user: User,
    access_token: null | string
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: {} as User,
    access_token: null
}

export const authSlice = createSlice( {
    name: 'auth',
    initialState,
    reducers: {
        logout: ( state ) => {
            state.isAuthenticated = false
            state.user            = {} as User
            state.access_token    = null
            Cookies.remove( 'access_token' )
        },
        setAccessToken: ( state, { payload }: PayloadAction<string> ) => {
            state.access_token = payload
        }
    },
    extraReducers: ( builder ) => {
        builder.addMatcher( authApi.endpoints.signup.matchFulfilled, ( state, { payload } ) => {
            state.user = payload
        } )

        builder.addMatcher( authApi.endpoints.login.matchFulfilled, ( state, { payload } ) => {
            if( payload.access_token && payload.user && payload.user.hasEmailVerified ){
                state.isAuthenticated = true
                state.user            = payload.user!
                Cookies.set( 'access_token', payload.access_token )
            } else{
                state.user = payload.user!
            }
        } )

        builder.addMatcher( authApi.endpoints.loginWithGoogle.matchFulfilled, ( state, { payload } ) => {
            state.isAuthenticated = true
            state.user            = payload.user!
            Cookies.set( 'access_token', payload.access_token )
        } )

        builder.addMatcher( authApi.endpoints.getAuthUser.matchFulfilled, ( state, { payload } ) => {
            state.isAuthenticated = true
            state.user            = payload
        } )
    }
} )

export const selectAuthState = ( state: RootState ) => state.auth

export const { logout, setAccessToken } = authSlice.actions