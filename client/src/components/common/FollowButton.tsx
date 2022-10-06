import React, { useState }                        from 'react'
import { User }                                   from "@interfaces/user.interfaces"
import { useFollowMutation, useUnfollowMutation } from "@services/usersApi"

interface FollowButtonProps {
    user: User
}

function FollowButton( props: FollowButtonProps ){
    //hooks
    const [user, setUser] = useState<User>( props.user )
    const [follow]        = useFollowMutation()
    const [unfollow]      = useUnfollowMutation()

    async function handleFollowClick( userId: number ){
        try {
            await follow( userId ).unwrap()

            setUser( { ...user, isCurrentUserFollow: true } )
        } catch ( err ) {
            console.error( err )
        }
    }

    async function handleUnfollowClick( userId: number ){
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
                <button onClick={ () => handleUnfollowClick( user.id ) }
                        className="button-blue rounded-full py-2 px-5">
                    Unfollow
                </button>
            ) : (
                <button onClick={ () => handleFollowClick( user.id ) }
                        className="button-blue rounded-full py-2 px-5">
                    Follow
                </button>
            ) }
        </>
    )
}

export default FollowButton;