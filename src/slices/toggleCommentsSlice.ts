import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { RootState } from '~/lib/store'

interface State {
    postIds: string[]
}

const initialState: State = {
    postIds: [],
}

export const toggleCommentsSlice = createSlice({
    name: 'toggleComments',
    initialState,
    reducers: {
        toggleComments: (state, { payload }: PayloadAction<string>) => {
            if (state.postIds.includes(payload)) {
                state.postIds = state.postIds.filter((id) => id !== payload)
            } else {
                state.postIds.push(payload)
            }
        },
    },
})

export const useToggleCommentsState = () => useSelector((state: RootState) => state.toggleComments)

export const { toggleComments } = toggleCommentsSlice.actions
