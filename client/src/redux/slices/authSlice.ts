import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AuthState }                  from "@interfaces/auth.interfaces"
import { User }                       from "@interfaces/user.interfaces"
import { RootState }                  from "@store/index";

const initialState: AuthState = {
    isCheckedAuth: false,
    isLoading: false,
    errors: {},
    isAuthenticated: false,
    user: <User>{}
}

export const authSlice = createSlice( {
    name: 'auth',
    initialState,
    reducers: {
        setLoading: ( state, { payload }: PayloadAction<boolean> ) => {
            state.isLoading = payload
        },
        setErrors: ( state, { payload }: PayloadAction<object> ) => {
            state.errors    = payload
            state.isLoading = false
        },
        setAuth: ( state, { payload }: PayloadAction<{ isAuthenticated: boolean, user: User }> ) => {
            state.isAuthenticated = payload.isAuthenticated
            state.user            = payload.user
            state.isLoading       = false
            state.isCheckedAuth   = true
        }
    },
} )

export const selectAuth = ( state: RootState ) => state.auth

export const { setLoading, setErrors, setAuth } = authSlice.actions