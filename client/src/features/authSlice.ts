import { createSlice } from "@reduxjs/toolkit"
import { RootState }   from "@store/store"
import { User }        from "@interfaces/user.interfaces"
import { authApi }     from "@services/authApi"
import Cookies         from "js-cookie"

interface AuthState {
    isAuthenticated: boolean
    user: User
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: {} as User
}

export const authSlice = createSlice( {
    name: 'auth',
    initialState,
    reducers: {
        logout: ( state ) => {
            state.isAuthenticated = false
            state.user            = {} as User
            Cookies.remove( 'access_token' )
        }
    },
    extraReducers: ( builder ) => {
        builder.addMatcher( authApi.endpoints.login.matchFulfilled, ( state, { payload } ) => {
            state.isAuthenticated = true
            state.user            = payload.user!
            Cookies.set( 'access_token', payload.access_token )
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

export const { logout } = authSlice.actions