import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { User } from "@interfaces/user.interfaces"

interface AuthState {
    isLoading: boolean
    isAuthenticated: boolean
    user: User | null
}

const initialState: AuthState = {
    isLoading: false,
    isAuthenticated: false,
    user: null
}

export const authSlice = createSlice( {
    name: 'auth',
    initialState,
    reducers: {
        logout: ( state ) => {
            state.isLoading       = false
            state.isAuthenticated = false
            state.user            = null
        },
        setAuth: ( state, { payload }: PayloadAction<User> ) => {
            state.isLoading       = false
            state.isAuthenticated = true
            state.user            = payload
        }
    }
} )

export const selectAuthState = ( state: RootState ) => state.auth

export const { setAuth, logout } = authSlice.actions