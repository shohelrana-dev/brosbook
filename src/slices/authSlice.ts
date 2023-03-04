import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { User } from "@interfaces/user.interfaces"
import { usersApi } from "@services/usersApi"

interface AuthState {
    isAuthenticated: boolean
    isChecked: boolean
    user: User | null,
    access_token: string,
    email: string
}

const initialState: AuthState = {
    isAuthenticated: false,
    isChecked: false,
    user: null,
    access_token: '',
    email: ''
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn: (state, { payload }: PayloadAction<{ user: User, access_token: string }>) => {
            state.isAuthenticated = true
            state.isChecked = true
            state.user = payload.user
            state.access_token = payload.access_token
        },
        userLoggedOut: (state) => {
            state.isAuthenticated = false
            state.isChecked = true
            state.user = null
            state.access_token = ''
        },
        setEmail: (state, { payload }: PayloadAction<string>) => {
            state.email = payload
        }
    },
    extraReducers: builder => {
        builder.addMatcher(usersApi.endpoints.getCurrentUser.matchFulfilled, (state, { payload }: PayloadAction<User>) => {
            state.user = payload
            state.isAuthenticated = true
            state.isChecked = true
        })
        builder.addMatcher(usersApi.endpoints.getCurrentUser.matchRejected, (state) => {
            state.user = null
            state.isAuthenticated = false
            state.isChecked = true
        })
    }
})

export const selectAuthState = (state: RootState) => state.auth

export const { userLoggedIn, userLoggedOut, setEmail } = authSlice.actions