import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const hydrateSlice = createSlice( {
    name: 'isHydrate',
    initialState: false,
    reducers: {
        setHydrate: ( state, action: PayloadAction<boolean> ) => {
            return action.payload
        }
    }
} )