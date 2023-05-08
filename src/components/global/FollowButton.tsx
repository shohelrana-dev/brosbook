"use client"
import React, { useState } from 'react'
import { User } from "@interfaces/user.interfaces"
import { useFollowMutation, useUnfollowMutation } from "@services/usersApi"
import Button from "@components/global/Button"
import ButtonOutline from "@components/global/ButtonOutline"
import { useConfirmAlert } from "react-use-confirm-alert"
import toast from "react-hot-toast"
import useUnauthorizedAlert from "@hooks/useUnauthorzedAlert"
import useAuthState from "@hooks/useAuthState"


interface FollowButtonProps {
    user: User
}

export default function FollowButton( props: FollowButtonProps ) {
    //hooks
    const [user, setUser]         = useState<User>( props.user )
    const [follow, { isLoading }] = useFollowMutation()
    const [unfollow]              = useUnfollowMutation()
    const { isAuthenticated }     = useAuthState()
    const confirmAlert            = useConfirmAlert()
    const unauthorizedAlert       = useUnauthorizedAlert()

    async function handleFollowClick() {
        if ( !isAuthenticated ) {
            unauthorizedAlert( {
                title: `Follow ${ user.fullName } to see what they share on ${ process.env.NEXT_PUBLIC_APP_NAME }.`,
                message: `Sign up so you never miss their Posts.`
            } )
            return
        }

        try {
            await follow( user.id ).unwrap()

            setUser( { ...user, isViewerFollow: true } )
            toast.success( `You followed @${ user.username }` )
        } catch ( err ) {
            toast.error( 'Something went wrong, Please try again.' )
            console.error( err )
        }
    }

    async function handleUnfollowClick() {
        await confirmAlert( {
            title: `Unfollow ${ user.username }?`,
            message: 'Their Posts will no longer show up in your home timeline. You can still view their profile.',
            confirmButtonLabel: 'Unfollow',
            onConfirm: async () => {
                try {
                    await unfollow( user.id ).unwrap()

                    setUser( { ...user, isViewerFollow: false } )
                    toast.success( `You unfollowed @${ user.username }` )
                } catch ( err ) {
                    toast.error( 'Something went wrong, Please try again.' )
                    console.error( err )
                }
            }
        } )
    }

    return (
        <>
            { user.isViewerFollow ? (
                <>
                    <ButtonOutline onClick={ handleUnfollowClick } size='sm' className="mt-0">
                        Unfollow
                    </ButtonOutline>
                </>
            ) : (
                <Button onClick={ handleFollowClick } isLoading={ isLoading } size="sm" className="mt-0">
                    Follow
                </Button>
            ) }
        </>
    )
}