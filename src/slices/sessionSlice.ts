import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { User } from '~/interfaces/user.interfaces'
import { RootState } from '~/lib/store'

interface SessionState {
    isLoggedIn: boolean
    isChecked: boolean
    user: User | null
}
const initialState: SessionState = {
    isLoggedIn: false,
    isChecked: false,
    user: null,
}

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        userLoggedIn: (state, { payload }: PayloadAction<User>) => {
            state.isLoggedIn = true
            state.isChecked = true
            state.user = payload
        },
        userLoggedOut: (state) => {
            state.isLoggedIn = false
            state.isChecked = true
            state.user = null
        },
    },
})

export const useSessionState = () => useSelector((state: RootState) => state.session)

export const { userLoggedIn, userLoggedOut } = sessionSlice.actions
