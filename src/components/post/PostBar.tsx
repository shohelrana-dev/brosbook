import { MouseEvent } from 'react'
import { FaRegComment as CommentIcon } from 'react-icons/fa'
import LikeButton from '~/components/post/LikeButton'
import LikesCount from '~/components/post/LikesCount'
import PostShare from '~/components/post/PostShare'
import IconButton from '~/components/ui/IconButton'
import Tooltip from '~/components/ui/Tooltip'
import useAuth from '~/hooks/useAuth'
import useCommentsVisibilty from '~/hooks/useCommentsVisibilty'
import useUnauthorizedAlert from '~/hooks/useUnauthorzedAlert'
import { Post } from '~/interfaces/posts.interfaces'
import { usePostLikeMutation, usePostUnlikeMutation } from '~/services/postsApi'

interface Props {
   post: Post
}

export default function PostBar({ post }: Props) {
   const { author, id, isViewerLiked, commentsCount, likesCount } = post

   //hooks
   const [postLike] = usePostLikeMutation()
   const [postUnlike] = usePostUnlikeMutation()
   const { isAuthenticated } = useAuth()
   const unauthorizedAlert = useUnauthorizedAlert()
   const { toggleCommentsVisibility } = useCommentsVisibilty(id)

   function handlePostLike(event: MouseEvent<HTMLButtonElement>) {
      event.currentTarget.disabled = true

      if (!isAuthenticated) {
         unauthorizedAlert({
            title: 'Like a Post to share the love.',
            message: `Join ${process.env.NEXT_PUBLIC_APP_NAME} now to let ${author.fullName} know you like their Post.`,
         })
         return
      }

      postLike({ postId: id, authorId: author.id })

      event.currentTarget.disabled = false
   }

   function handlePostUnlike(event: MouseEvent<HTMLButtonElement>) {
      event.currentTarget.disabled = true

      postUnlike({ postId: id, authorId: author.id })

      event.currentTarget.disabled = false
   }

   return (
      <div className="flex flex-wrap mt-2 border-y border-gray-200 py-1 justify-around items-center">
         <div className="flex flex-wrap items-center gap-1">
            <LikeButton
               isViewerLiked={isViewerLiked}
               handleLike={handlePostLike}
               handleUnlike={handlePostUnlike}
            />

            <LikesCount isViewerLiked={isViewerLiked} likesCount={likesCount} />
         </div>
         <div className="flex flex-wrap items-center">
            <Tooltip content="Comments" disableWrapper>
               <IconButton onClick={toggleCommentsVisibility}>
                  <CommentIcon size="18" />
               </IconButton>
            </Tooltip>
            <p className="text-gray-600">{commentsCount}</p>
         </div>

         <PostShare post={post} />
      </div>
   )
}
