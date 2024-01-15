import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '~/store/index'

interface State {
	postIds: string[]
}

const initialState: State = {
	postIds: [],
}

export const toggleCommentsVisibilitySlice = createSlice({
	name: 'toggleCommentsVisibility',
	initialState,
	reducers: {
		toggleCommentsVisibility: (state, { payload }: PayloadAction<string>) => {
			if (state.postIds.includes(payload)) {
				state.postIds = state.postIds.filter(id => id !== payload)
			} else {
				state.postIds.push(payload)
			}
		},
	},
})

export const selectToggleCommentsVisibilityState = (state: RootState) => state.toggleCommentsVisibility

export const { toggleCommentsVisibility } = toggleCommentsVisibilitySlice.actions
