import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SettingsState, User }        from "@interfaces/user.interfaces"

const initialState: SettingsState = {
    isLoading: false,
    user: <User>{},
    errors: {}
}

export const settingsSlice = createSlice( {
    name: 'settings',
    initialState,
    reducers: {
        setLoading: ( state, { payload }: PayloadAction<boolean> ) => {
            state.isLoading = true
        },
        setErrors: ( state, { payload }: PayloadAction<{}> ) => {
            state.errors    = payload
            state.isLoading = false
        },

    }
} )

export const { setLoading, setErrors } = settingsSlice.actions