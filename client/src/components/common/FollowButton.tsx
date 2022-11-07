"use client"
import React, { useState }                        from 'react'
import { User }                                   from "@interfaces/user.interfaces"
import { useFollowMutation, useUnfollowMutation } from "@services/usersApi"
import Button from "@components/common/Button"

interface FollowButtonProps {
    user: User
}

function FollowButton( props: FollowButtonProps ){
    //hooks
    const [user, setUser] = useState<User>( props.user )
    const [follow]        = useFollowMutation()
    const [unfollow]      = useUnfollowMutation()

    async function handleFollowClick( userId: string ){
        try {
            await follow( userId ).unwrap()

            setUser( { ...user, isCurrentUserFollow: true } )
        } catch ( err ) {
            console.error( err )
        }
    }

    async function handleUnfollowClick( userId: string ){
        try {
            await unfollow( userId ).unwrap()

            setUser( { ...user, isCurrentUserFollow: false } )
        } catch ( err ) {
            console.error( err )
        }
    }

    return (
        <>
            { user.isCurrentUserFollow ? (
                <Button onClick={ () => handleUnfollowClick( user.id ) }>
                    Unfollow
                </Button>
            ) : (
                <Button onClick={ () => handleFollowClick( user.id ) }>
                    Follow
                </Button>
            ) }
        </>
    )
}

export default FollowButton;