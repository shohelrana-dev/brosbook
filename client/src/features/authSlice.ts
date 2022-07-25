import { createSlice } from "@reduxjs/toolkit"
import { RootState }   from "@store/store"
import { User }        from "@interfaces/user.interfaces"
import { authApi }     from "@services/authApi"

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
    reducers: {},
    extraReducers: ( builder ) => {
        builder.addMatcher( authApi.endpoints.login.matchFulfilled, ( state, { payload } ) => {
            state.isAuthenticated = true
            state.user            = payload.user!
        } )

        builder.addMatcher( authApi.endpoints.loginWithGoogle.matchFulfilled, ( state, { payload } ) => {
            state.isAuthenticated = true
            state.user            = payload.user!
        } )

        builder.addMatcher( authApi.endpoints.logout.matchFulfilled, ( state ) => {
            state.isAuthenticated = false
            state.user            = {} as User
        } )

        builder.addMatcher( authApi.endpoints.getAuthUser.matchFulfilled, ( state, { payload } ) => {
            state.isAuthenticated = true
            state.user            = payload.user!
        } )
    }
} )

export const selectAuthState = ( state: RootState ) => state.auth