import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@store/index'

const initialState: { value: string } = { value: '0px' }

export const navbarHeightSlice = createSlice({
    name: 'navbarHeight',
    initialState,
    reducers: {
        setNavbarHeight: (state, { payload }: PayloadAction<string>) => {
            state.value = payload
        },
    },
})

export const selectNavbarHeight = (state: RootState) => state.navbarHeight.value

export const { setNavbarHeight } = navbarHeightSlice.actions
