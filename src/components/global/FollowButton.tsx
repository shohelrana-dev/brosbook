'use client'
import { useState } from 'react'
import { useConfirmAlert } from 'react-use-confirm-alert'
import Button from '~/components/global/Button'
import siteMetadata from '~/config/siteMetadata'
import useSession from '~/hooks/useSession'
import useUnauthorizedAlert from '~/hooks/useUnauthorzedAlert'
import { User } from '~/interfaces/user.interfaces'
import { ButtonProps } from '~/lib/nextui'
import { useFollowMutation, useUnfollowMutation } from '~/services/usersApi'

interface Props extends ButtonProps {
    user: User
}

export default function FollowButton({ user: _user, ...rest }: Props) {
    //hooks
    const [user, setUser] = useState<User>(_user)
    const [follow, { isLoading }] = useFollowMutation()
    const [unfollow] = useUnfollowMutation()
    const { isLoggedIn } = useSession()
    const confirmAlert = useConfirmAlert()
    const unauthorizedAlert = useUnauthorizedAlert()

    async function handleFollow() {
        if (!isLoggedIn) {
            unauthorizedAlert({
                title: `Follow ${user.fullName} to see what they share on ${siteMetadata.appName}.`,
                message: `Sign up so you never miss their Posts.`,
            })
            return
        }

        await follow(user.id).unwrap()
        setUser({ ...user, isViewerFollow: true })
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
                } catch (err: any) {
                    console.error(err)
                }
            },
        })
    }
    const { isViewerFollow } = user

    return (
        <Button
            variant={isViewerFollow ? 'bordered' : 'solid'}
            size='sm'
            isLoading={isLoading}
            onClick={isViewerFollow ? handleUnfollow : handleFollow}
            {...rest}
        >
            {isViewerFollow ? 'Unfollow' : 'Follow'}
        </Button>
    )
}
