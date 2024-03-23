import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { User } from '~/interfaces/user.interfaces'
import { RootState } from '~/store'
import isServer from '~/utils/isServer'
import { getSession } from '~/utils/session'

interface AuthState {
    isAuthenticated: boolean
    isChecked: boolean
    user: User | null
}

const session = !isServer ? getSession() : ({} as any)

const initialState: AuthState = {
    isAuthenticated: session.isLoggedIn || false,
    isChecked: false,
    user: session.user || null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn: (state, { payload }: PayloadAction<User>) => {
            state.isAuthenticated = true
            state.isChecked = true
            state.user = payload
        },
        userLoggedOut: (state) => {
            state.isAuthenticated = false
            state.isChecked = true
            state.user = null
        },
    },
})

export const useAuthState = () => useSelector((state: RootState) => state.auth)

export const { userLoggedIn, userLoggedOut } = authSlice.actions
