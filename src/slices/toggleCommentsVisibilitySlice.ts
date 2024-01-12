import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

export const { toggleCommentsVisibility: toggleCommentsVisibilityAction } =
	toggleCommentsVisibilitySlice.actions

export function useCommentsVisibilty(postId: string, initialVisible = false) {
	const [isCommentsVisible, steIsCommentsVisible] = useState(initialVisible)
	const { postIds } = useSelector(selectToggleCommentsVisibilityState)
	const dispatch = useDispatch()

	useEffect(() => {
		if (postIds.includes(postId)) {
			steIsCommentsVisible(true)
		} else {
			steIsCommentsVisible(false)
		}
	}, [postIds])

	function toggleCommentsVisibility() {
		dispatch(toggleCommentsVisibilityAction(postId))
	}

	return { isCommentsVisible, toggleCommentsVisibility }
}
