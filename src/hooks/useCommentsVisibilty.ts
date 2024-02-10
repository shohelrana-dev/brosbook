import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
   toggleComments as toggleCommentsAction,
   useToggleCommentsState,
} from '~/slices/toggleCommentsSlice'

export default function useCommentsVisibilty(postId: string, initialVisible = false) {
   const [isCommentsVisible, steIsCommentsVisible] = useState(initialVisible)
   const { postIds } = useToggleCommentsState()
   const dispatch = useDispatch()

   useEffect(() => {
      if (postIds.includes(postId)) {
         steIsCommentsVisible(true)
      } else {
         steIsCommentsVisible(false)
      }
   }, [postIds, postId])

   function toggleCommentsVisibility() {
      dispatch(toggleCommentsAction(postId))
   }

   return { isCommentsVisible, toggleCommentsVisibility }
}
