"use client"
import React, {useState} from 'react'
import {User} from "@interfaces/user.interfaces"
import {useFollowMutation, useUnfollowMutation} from "@services/usersApi"
import Button from "@components/common/Button"
import ButtonOutline from "@components/common/ButtonOutline"
import ConfirmAlert from "@components/common/ConfirmAlert"


interface FollowButtonProps {
    user: User
}

function FollowButton(props: FollowButtonProps) {
    //hooks
    const [user, setUser] = useState<User>(props.user)
    const [follow] = useFollowMutation()
    const [unfollow] = useUnfollowMutation()
    const [isOpenUnfollowAlert, setIsOpenUnfollowAlert] = useState<boolean>(false)

    async function handleFollowClick() {
        try {
            await follow(user.id).unwrap()

            setUser({...user, isCurrentUserFollow: true})
        } catch (err) {
            console.error(err)
        }
    }

    async function handleUnfollowClick() {
        try {
            await unfollow(user.id).unwrap()

            setUser({...user, isCurrentUserFollow: false})
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            {user.isCurrentUserFollow ? (
                <>
                    <ButtonOutline onClick={() => setIsOpenUnfollowAlert(true)} size='sm' className="mt-0">
                        Unfollow
                    </ButtonOutline>
                    <ConfirmAlert
                        isOpen={isOpenUnfollowAlert}
                        title={`Unfollow ${user.username}?`}
                        message="Their Posts will no longer show up in your home timeline. You can still view their profile."
                        okButtonLabel="Unfollow"
                        onClose={()=> setIsOpenUnfollowAlert(false)}
                        onConfirm={handleUnfollowClick}
                    />
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