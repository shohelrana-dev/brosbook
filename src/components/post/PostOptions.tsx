import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AiOutlineCopy as CopyIcon, AiOutlineUserAdd as FollowIcon } from 'react-icons/ai'
import { BsThreeDots as ThreeDotsIcon } from 'react-icons/bs'
import { MdHideSource as HideIcon } from 'react-icons/md'
import { RiDeleteBin5Line as DeleteIcon, RiUserUnfollowLine as UnfollowIcon } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { useConfirmAlert } from 'react-use-confirm-alert'
import { toast } from 'sonner'
import IconButton from '~/components/ui/IconButton'
import Tooltip from '~/components/ui/Tooltip'
import useAuth from '~/hooks/useAuth'
import useUnauthorizedAlert from '~/hooks/useUnauthorzedAlert'
import { ListResponse } from '~/interfaces/index.interfaces'
import { Post } from '~/interfaces/posts.interfaces'
import { User } from '~/interfaces/user.interfaces'
import { postsApi, useDeletePostMutation } from '~/services/postsApi'
import { useFollowMutation, useUnfollowMutation } from '~/services/usersApi'
import { AppDispatch } from '~/store'

interface Props {
   post: Post
}

export default function PostOptions({ post }: Props) {
   const [follow] = useFollowMutation()
   const [unfollow] = useUnfollowMutation()
   const [deletePost] = useDeletePostMutation()

   const { user: currentUser, isAuthenticated } = useAuth()
   const [author, setAuthor] = useState<User>(post.author)
   const confirmAlert = useConfirmAlert()
   const unauthorizedAlert = useUnauthorizedAlert()
   const dispatch = useDispatch<AppDispatch>()
   const pathname = usePathname()

   const isCurrentUserAuthor = isAuthenticated && author && author.id === currentUser?.id

   async function handleDeletePostClick() {
      await confirmAlert({
         title: 'Delete Post?',
         message: 'This can’t be undone and it will be removed from your profile',
         confirmButtonLabel: 'Delete',
         onConfirm: async () => {
            try {
               await deletePost(post.id).unwrap()
               toast.success('Post deleted.')
            } catch (err: any) {
               toast.error(err?.data?.message || 'Post deleting failed.')
            }
         },
      })
   }

   async function handleFollowClick() {
      if (!isAuthenticated) {
         unauthorizedAlert({
            title: `Follow ${author.fullName} to see what they share on ${process.env.NEXT_PUBLIC_APP_NAME}.`,
            message: `Sign up so you never miss their Posts.`,
         })
         return
      }

      try {
         const user = await follow(author.id).unwrap()

         setAuthor(user)
         toast.success(`You followed @${author.username}`)
      } catch (err: any) {
         console.error(err)
      }
   }

   async function handleUnfollowClick() {
      try {
         const user = await unfollow(author.id).unwrap()

         setAuthor(user)
         toast.success(`You unfollowed @${author.username}`)
      } catch (err) {
         console.error(err)
      }
   }

   function handleHidePost() {
      const removePostFromDraft = (draft: ListResponse<Post>) => {
         if (draft?.items && draft.items.length > 0) {
            draft.items = draft.items.filter((p) => p.id !== post.id)
         }
      }
      dispatch(
         postsApi.util.updateQueryData(
            'getPosts',
            { authorId: post.author.id } as any,
            removePostFromDraft
         )
      )
      dispatch(postsApi.util.updateQueryData('getFeedPosts', undefined as any, removePostFromDraft))
   }

   function handlecopyPostLink() {
      navigator.clipboard
         .writeText(`${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.id}`)
         .then(() => {
            toast.success('Post link copied.')
         })
   }

   return (
      <Dropdown placement="bottom-end">
         <Tooltip content="Post options">
            <DropdownTrigger>
               <IconButton>
                  <ThreeDotsIcon size="18" />
               </IconButton>
            </DropdownTrigger>
         </Tooltip>

         <DropdownMenu variant="faded" aria-label="Post options">
            {isCurrentUserAuthor && (
               <DropdownItem
                  onClick={handleDeletePostClick}
                  startContent={<DeleteIcon size="18" />}
                  title="Delete"
               />
            )}

            {!isCurrentUserAuthor &&
               (author.isViewerFollow ? (
                  <DropdownItem
                     key="unfollow"
                     onClick={handleUnfollowClick}
                     startContent={<UnfollowIcon size="18" />}
                     title={`Unfollow @${author.username}`}
                  />
               ) : (
                  <DropdownItem
                     key="follow"
                     onClick={handleFollowClick}
                     startContent={<FollowIcon size="18" />}
                     title={`Follow @${author.username}`}
                  />
               ))}

            <DropdownItem
               key="copy"
               onClick={handlecopyPostLink}
               startContent={<CopyIcon size="18" />}
               title="Copy link to post"
            />

            {!pathname?.startsWith('/posts/') ? (
               <DropdownItem
                  key="hide"
                  onClick={handleHidePost}
                  startContent={<HideIcon size="18" />}
                  title="Hide"
               />
            ) : (
               (null as any)
            )}
         </DropdownMenu>
      </Dropdown>
   )
}
