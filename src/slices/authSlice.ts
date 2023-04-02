import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "@store/index"
import { User } from "@interfaces/user.interfaces"

interface AuthState {
    isAuthenticated: boolean
    user: User | null,
    email: string | null
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    email: null
}

export const authSlice = createSlice( {
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn: ( state, { payload }: PayloadAction<User> ) => {
            state.isAuthenticated = true
            state.user            = payload
        },
        userLoggedOut: ( state ) => {
            state.isAuthenticated = false
            state.user            = null
        },
        setEmail: ( state, { payload }: PayloadAction<string> ) => {
            state.email = payload
        }
    }
} )

export const selectAuthState = ( state: RootState ) => state.auth

export const { userLoggedIn, userLoggedOut, setEmail } = authSlice.actions