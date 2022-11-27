"use client"
import React, {useState} from 'react'
import {User} from "@interfaces/user.interfaces"
import {useFollowMutation, useUnfollowMutation} from "@services/usersApi"
import Button from "@components/common/Button"
import ButtonOutline from "@components/common/ButtonOutline"
import useConfirm from "@hooks/useConfirm"


interface FollowButtonProps {
    user: User
}

function FollowButton(props: FollowButtonProps) {
    //hooks
    const [user, setUser] = useState<User>(props.user)
    const [follow] = useFollowMutation()
    const [unfollow] = useUnfollowMutation()
    const confirm = useConfirm()

    async function handleFollowClick() {
        try {
            await follow(user.id).unwrap()

            setUser({...user, isViewerFollow: true})
        } catch (err) {
            console.error(err)
        }
    }

    async function handleUnfollowClick() {
        const isConfirm = await confirm({
            title: `Unfollow ${user.username}?`,
            message: 'Their Posts will no longer show up in your home timeline. You can still view their profile.',
            confirmButtonLabel: 'Unfollow'
        })
        if(!isConfirm) return

        try {
            await unfollow(user.id).unwrap()

            setUser({...user, isViewerFollow: false})
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            {user.isViewerFollow ? (
                <>
                    <ButtonOutline onClick={handleUnfollowClick} size='sm' className="mt-0">
                        Unfollow
                    </ButtonOutline>
                </>
            ) : (
                <Button onClick={handleFollowClick} size="sm" className="mt-0">
                    Follow
                </Button>
            )}
        </>
    )
}

export default FollowButton;