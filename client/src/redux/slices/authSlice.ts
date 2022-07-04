import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LoginFormData }   from "@interfaces/auth.interfaces"
import { User }                       from "@interfaces/user.interfaces"
import { RootState }                  from "@store/index"
import { createAsyncThunk }           from "@reduxjs/toolkit"
import api                            from "@api/index"

export interface AuthState {
    isCheckedAuth: boolean
    isLoading: boolean
    errors: {
        firstName?: { msg: string }
        lastName?: { msg: string }
        email?: { msg: string }
        username?: { msg: string }
        password?: { msg: string }
        confirmPassword?: { msg: string }
    }
    isAuthenticated: boolean
    user: User
}

const initialState: AuthState = {
    isCheckedAuth: false,
    isLoading: false,
    errors: {},
    isAuthenticated: false,
    user: <User>{}
}

export const login = createAsyncThunk( 'auth/login', async( formData: LoginFormData, thunkAPI ) => {
    try {
        const { data } = await api.auth.login( formData )
        return data.user
    } catch ( err ) {
        return thunkAPI.rejectWithValue( err )
    }
} )

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
    extraReducers: ( builder ) => {
        builder.addCase( login.pending, ( state ) => {
            state.isLoading = true
        } )
        builder.addCase( login.fulfilled, ( state, action ) => {
            state.isLoading       = false
            state.isAuthenticated = true
            state.user            = action.payload
        } )
        builder.addCase( login.rejected, ( state, action ) => {
            state.isLoading = false
            state.errors    = action?.payload?.response?.data?.errors || {}
        } )
    }
} )

export const selectAuth = ( state: RootState ) => state.auth

export const { setLoading, setErrors, setAuth } = authSlice.actions