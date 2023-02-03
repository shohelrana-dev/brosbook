"use client"
import React, { useState } from 'react'
import { User } from "@interfaces/user.interfaces"
import { useFollowMutation, useUnfollowMutation } from "@services/usersApi"
import Button from "@components/common/Button"
import ButtonOutline from "@components/common/ButtonOutline"
import useConfirmAlert from "@hooks/useConfirmAlert"
import toast from "react-hot-toast"
import useUnauthorizedPopup from "@hooks/useUnauthorzedPopup";
import useAuthState from "@hooks/useAuthState";


interface FollowButtonProps {
    user: User
}

function FollowButton( props: FollowButtonProps ){
    //hooks
    const [user, setUser]     = useState<User>( props.user )
    const [follow]            = useFollowMutation()
    const [unfollow]          = useUnfollowMutation()
    const { isAuthenticated } = useAuthState()
    const confirmAlert             = useConfirmAlert()
    const unauthorizedPopup   = useUnauthorizedPopup()

    async function handleFollowClick(){
        if( ! isAuthenticated ){
            unauthorizedPopup( {
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

    async function handleUnfollowClick(){
        const isConfirm = await confirmAlert( {
            title: `Unfollow ${ user.username }?`,
            message: 'Their Posts will no longer show up in your home timeline. You can still view their profile.',
            confirmButtonLabel: 'Unfollow'
        } )
        if( ! isConfirm ) return

        try {
            await unfollow( user.id ).unwrap()

            setUser( { ...user, isViewerFollow: false } )
            toast.success( `You unfollowed @${ user.username }` )
        } catch ( err ) {
            toast.error( 'Something went wrong, Please try again.' )
            console.error( err )
        }
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
                <Button onClick={ handleFollowClick } size="sm" className="mt-0">
                    Follow
                </Button>
            ) }
        </>
    )
}

export default FollowButton;