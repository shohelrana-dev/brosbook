import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { User } from '~/interfaces/user.interfaces'
import { RootState } from '~/store/index'

interface AuthState {
	isAuthenticated: boolean
	isChecked: boolean
	user: User | null
	email: string | null
}

const initialState: AuthState = {
	isAuthenticated: false,
	isChecked: false,
	user: null,
	email: null,
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
		userLoggedOut: state => {
			state.isAuthenticated = false
			state.isChecked = true
			state.user = null
		},
		setEmail: (state, { payload }: PayloadAction<string>) => {
			state.email = payload
		},
	},
})

export const useAuthState = () => useSelector((state: RootState) => state.auth)

export const { userLoggedIn, userLoggedOut, setEmail } = authSlice.actions
