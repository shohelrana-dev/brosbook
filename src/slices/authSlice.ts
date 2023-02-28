import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { User } from "@interfaces/user.interfaces"
import { usersApi } from "@services/usersApi"

interface AuthState {
    isAuthenticated: boolean
    isChecked: boolean
    user: User | null,
    email?: string
}

const initialState: AuthState = {
    isAuthenticated: false,
    isChecked: false,
    user: null,
    email: ''
}

export const authSlice = createSlice( {
    name: 'auth',
    initialState,
    reducers: {
        setAuth: ( state, { payload }: PayloadAction<User> ) => {
            state.isAuthenticated = true
            state.isChecked       = true
            state.user            = payload
        },
        logout: ( state ) => {
            state.isAuthenticated = false
            state.isChecked       = true
            state.user            = null
        },
        setEmail: ( state, { payload }: PayloadAction<string> ) => {
            state.email = payload
        }
    },
    extraReducers: builder => {
        builder.addMatcher( usersApi.endpoints.getCurrentUser.matchFulfilled, ( state, { payload }: PayloadAction<User> ) => {
            state.user            = payload
            state.isAuthenticated = true
            state.isChecked       = true
        } )
        builder.addMatcher( usersApi.endpoints.getCurrentUser.matchRejected, ( state ) => {
            state.user            = null
            state.isAuthenticated = false
            state.isChecked       = true
        } )
    }
} )

export const selectAuthState = ( state: RootState ) => state.auth

export const { setAuth, logout, setEmail } = authSlice.actions