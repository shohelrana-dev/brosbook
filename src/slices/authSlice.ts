import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { User } from "@interfaces/user.interfaces"

interface AuthState {
    isAuthenticated: boolean
    isChecked: boolean
    user: User | null,
    email: string | null
}

const initialState: AuthState = {
    isAuthenticated: false,
    isChecked: false,
    user: null,
    email: null
}

function getStoredState(): AuthState{
    if( typeof window === "undefined" ){
        return initialState
    }

    const serializeState = localStorage.getItem( 'auth' )
    if( serializeState ){
        const storedState = JSON.parse( serializeState )
        if( Object.keys( storedState ).length > 0 ){
            return storedState
        }
    }

    return initialState
}

export const authSlice = createSlice( {
    name: 'auth',
    initialState: getStoredState,
    reducers: {
        userLoggedIn: ( state, { payload }: PayloadAction<User> ) => {
            state.isAuthenticated = true
            state.isChecked       = true
            state.user            = payload
            localStorage.setItem( 'auth', JSON.stringify( state ) )
        },
        userLoggedOut: ( state ) => {
            state.isAuthenticated = false
            state.isChecked       = true
            state.user            = null
            localStorage.removeItem( 'auth' )
        },
        setEmail: ( state, { payload }: PayloadAction<string> ) => {
            state.email = payload
        }
    }
} )

export const selectAuthState = ( state: RootState ) => state.auth

export const { userLoggedIn, userLoggedOut, setEmail } = authSlice.actions