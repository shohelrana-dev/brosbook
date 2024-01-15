import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	selectToggleCommentsVisibilityState,
	toggleCommentsVisibility as toggleCommentsVisibilityAction,
} from '~/slices/toggleCommentsVisibilitySlice'

export default function useCommentsVisibilty(postId: string, initialVisible = false) {
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
