'use client'
import { ButtonProps } from '@nextui-org/react'
import { useState } from 'react'
import { useConfirmAlert } from 'react-use-confirm-alert'
import { toast } from 'sonner'
import Button from '~/components/ui/Button'
import useAuth from '~/hooks/useAuth'
import useUnauthorizedAlert from '~/hooks/useUnauthorzedAlert'
import { User } from '~/interfaces/user.interfaces'
import { useFollowMutation, useUnfollowMutation } from '~/services/usersApi'
import siteMetadata from '~/utils/siteMetadata'

interface Props extends ButtonProps {
   user: User
}

export default function FollowButton({ user: _user, ...rest }: Props) {
   //hooks
   const [user, setUser] = useState<User>(_user)
   const [follow, { isLoading }] = useFollowMutation()
   const [unfollow] = useUnfollowMutation()
   const { isAuthenticated } = useAuth()
   const confirmAlert = useConfirmAlert()
   const unauthorizedAlert = useUnauthorizedAlert()

   async function handleFollow() {
      if (!isAuthenticated) {
         unauthorizedAlert({
            title: `Follow ${user.fullName} to see what they share on ${siteMetadata.appName}.`,
            message: `Sign up so you never miss their Posts.`,
         })
         return
      }

      try {
         await follow(user.id).unwrap()

         setUser({ ...user, isViewerFollow: true })
         toast.success(`You followed @${user.username}`)
      } catch (err: any) {
         toast.error(err?.data?.message || 'Something went wrong, Please try again.')
         console.error(err)
      }
   }

   async function handleUnfollow() {
      await confirmAlert({
         title: `Unfollow ${user.username}?`,
         message:
            'Their Posts will no longer show up in your home timeline. You can still view their profile.',
         confirmButtonLabel: 'Unfollow',
         onConfirm: async () => {
            try {
               await unfollow(user.id).unwrap()

               setUser({ ...user, isViewerFollow: false })
               toast.success(`You unfollowed @${user.username}`)
            } catch (err: any) {
               toast.error(err?.data?.message || 'Something went wrong, Please try again.')
               console.error(err)
            }
         },
      })
   }
   const { isViewerFollow } = user

   return (
      <Button
         variant={isViewerFollow ? 'bordered' : 'solid'}
         size="sm"
         isLoading={isLoading}
         onClick={isViewerFollow ? handleUnfollow : handleFollow}
         {...rest}
      >
         {isViewerFollow ? 'Unfollow' : 'Follow'}
      </Button>
   )
}
