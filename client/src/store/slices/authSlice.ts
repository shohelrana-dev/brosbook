import { createSlice }      from "@reduxjs/toolkit"
import { RootState }        from "@store/index"
import { createAsyncThunk } from "@reduxjs/toolkit"

import { LoginFormData, ResetPassFormData, SignupFormData } from "@interfaces/auth.interfaces"
import { User }                                             from "@interfaces/user.interfaces"
import { InputErrors }                                      from "@interfaces/index.interfaces"
import authApi                                              from "@api/auth"

interface AuthState {
    isCheckedAuth: boolean
    isLoading: boolean
    isSuccess: boolean,
    isError: boolean,
    message: string | null,
    inputErrors: InputErrors
    isAuthenticated: boolean
    user: User
}

const initialState: AuthState = {
    isCheckedAuth: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: null,
    inputErrors: {},
    isAuthenticated: false,
    user: <User>{}
}

export const signup = createAsyncThunk<any, SignupFormData, { rejectValue: any }>
( 'auth/signup', async( formData, thunkAPI ) => {
    try {
        const response = await authApi.signup( formData )
        return {
            message: response.data.message,
            user: response.data.user
        }
    } catch ( err: any ) {
        return thunkAPI.rejectWithValue( {
            message: err?.response?.data?.message,
            errors: err?.response?.data?.errors
        } )
    }
} )

export const login = createAsyncThunk<any, LoginFormData, { rejectValue: any }>
( 'auth/login', async( formData, thunkAPI ) => {
    try {
        const response = await authApi.login( formData )
        return {
            message: response.data.message,
            user: response.data.user
        }
    } catch ( err: any ) {
        return thunkAPI.rejectWithValue( {
            message: err?.response?.data?.message,
            errors: err?.response?.data?.errors
        } )
    }
} )

export const loginWithGoogle = createAsyncThunk<any, string, { rejectValue: any }>
( 'auth/login_with_google', async( token, thunkAPI ) => {
    try {
        const response = await authApi.loginWithGoogle( token )
        return {
            message: response.data.message,
            user: response.data.user
        }
    } catch ( err: any ) {
        return thunkAPI.rejectWithValue( {
            message: err?.response?.data?.message,
            errors: err?.response?.data?.errors
        } )
    }
} )

export const forgotPassword = createAsyncThunk<any, string, { rejectValue: any }>
( 'auth/forgot_password', async( email, thunkAPI ) => {
    try {
        const response = await authApi.forgotPassword( email )
        return response.data
    } catch ( err: any ) {
        return thunkAPI.rejectWithValue( {
            message: err?.response?.data?.message,
            errors: err?.response?.data?.errors
        } )
    }
} )

export const resetPassword = createAsyncThunk<any, ResetPassFormData, { rejectValue: any }>
( 'auth/reset_password', async( formData, thunkAPI ) => {
    try {
        const response = await authApi.resetPassword( formData )
        return response.data
    } catch ( err: any ) {
        return thunkAPI.rejectWithValue( {
            message: err?.response?.data?.message,
            errors: err?.response?.data?.errors
        } )
    }
} )

export const verifyAccount = createAsyncThunk<any, string, { rejectValue: any }>
( 'auth/verify_account', async( token, thunkAPI ) => {
    try {
        const response = await authApi.verifyAccount( token )
        return response.data
    } catch ( err: any ) {
        return thunkAPI.rejectWithValue( err?.response?.data?.message )
    }
} )

export const logout = createAsyncThunk<any, void, { rejectValue: any }>
( 'auth/logout', async( _, thunkAPI ) => {
    try {
        const response = await authApi.logout()
        return response.data
    } catch ( err: any ) {
        return thunkAPI.rejectWithValue( err?.response?.data?.message )
    }
} )

export const authSlice = createSlice( {
    name: 'auth',
    initialState,
    reducers: {
        reset: ( state ) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError   = false
            state.message   = null
        },
        clearInputErrors: ( state ) => {
            state.inputErrors = {}
        }
    },
    extraReducers: ( builder ) => {
        const thunks = [signup, login, loginWithGoogle, forgotPassword, resetPassword, verifyAccount, logout]
        thunks.forEach( thunk => {
            builder.addCase( thunk.pending, ( state ) => {
                    state.isLoading   = true
                    state.isSuccess   = false
                    state.isError     = false
                    state.message     = null
                } )
                .addCase( thunk.rejected, ( state, action ) => {
                    state.isLoading   = false
                    state.isError     = true
                    state.message     = action.payload.message
                    state.inputErrors = action.payload.errors
                } )
        } )

        builder.addCase( signup.fulfilled, ( state, action ) => {
                state.isLoading       = false
                state.isSuccess       = true
                state.isAuthenticated = true
                state.user            = action.payload.user
                state.message         = action.payload.message
            } )

            .addCase( login.fulfilled, ( state, action ) => {
                state.isLoading       = false
                state.isSuccess       = true
                state.isAuthenticated = true
                state.user            = action.payload.user
                state.message         = action.payload.message
            } )

            .addCase( loginWithGoogle.fulfilled, ( state, action ) => {
                state.isLoading       = false
                state.isSuccess       = true
                state.isAuthenticated = true
                state.user            = action.payload.user
                state.message         = action.payload.message
            } )

            .addCase( logout.fulfilled, ( state, action ) => {
                state.isLoading       = false
                state.isSuccess       = true
                state.isAuthenticated = false
                state.user            = {} as User
                state.message         = action.payload
            } )

            .addCase( forgotPassword.fulfilled, ( state, action ) => {
                state.isLoading = false
                state.isSuccess = true
                state.message   = action.payload.message
            } )

            .addCase( resetPassword.fulfilled, ( state, action ) => {
                state.isLoading = false
                state.isSuccess = true
                state.message   = action.payload.message
            } )

            .addCase( verifyAccount.fulfilled, ( state, action ) => {
                state.isLoading = false
                state.isSuccess = true
                state.message   = action.payload
            } )
    }
} )

export const selectAuthState = ( state: RootState ) => state.auth

export const { reset, clearInputErrors } = authSlice.actions