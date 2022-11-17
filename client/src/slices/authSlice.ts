import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { User } from "@interfaces/user.interfaces"
import { authApi, LoginResponse } from "@services/authApi"
import Cookies from "js-cookie"
import { accountApi } from "@services/accountApi"

interface AuthState {
    isLoading: boolean
    isAuthenticated: boolean
    user: User
}

const initialState: AuthState = {
    isLoading: false,
    isAuthenticated: false,
    user: {} as User
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false
            state.user = {} as User
            Cookies.remove('access_token')
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(authApi.endpoints.signup.matchFulfilled, (state, { payload }: PayloadAction<User>) => {
            state.user = payload
        })

        builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }: PayloadAction<LoginResponse>) => {
            if (payload.access_token && payload.user && payload.user.hasEmailVerified) {
                state.isLoading = false
                state.isAuthenticated = true
                state.user = payload.user!
                Cookies.set('access_token', payload.access_token)
            } else {
                state.user = payload.user!
            }
        })

        builder.addMatcher(authApi.endpoints.loginWithGoogle.matchFulfilled, (state, { payload }: PayloadAction<LoginResponse>) => {
            state.isLoading = false
            state.isAuthenticated = true
            state.user = payload.user!
            Cookies.set('access_token', payload.access_token)
        })

        builder.addMatcher(accountApi.endpoints.updateProfile.matchFulfilled, (state, { payload }: PayloadAction<User>) => {
            state.user = payload
        })

        builder.addMatcher(accountApi.endpoints.changeUsername.matchFulfilled, (state, { payload }: PayloadAction<User>) => {
            state.user.username = payload.username
        })
    }
})

export const selectAuthState = (state: RootState) => state.auth

export const { logout } = authSlice.actions