import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { User } from "@interfaces/user.interfaces"

interface AuthState {
    isLoading: boolean
    isAuthenticated: boolean
    user: User | null,
    email?: string
}

const initialState: AuthState = {
    isLoading: false,
    isAuthenticated: false,
    user: null,
    email: ''
}

export const authSlice = createSlice( {
    name: 'auth',
    initialState,
    reducers: {
        setAuth: ( state, { payload }: PayloadAction<User> ) => {
            state.isLoading       = false
            state.isAuthenticated = true
            state.user            = payload
        },
        logout: ( state ) => {
            state.isLoading       = false
            state.isAuthenticated = false
            state.user            = null
        },
        setEmail: ( state, { payload }: PayloadAction<string> ) => {
            state.email = payload
        }
    }
} )

export const selectAuthState = ( state: RootState ) => state.auth

export const { setAuth, logout, setEmail } = authSlice.actions