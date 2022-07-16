import React, { useState } from 'react'
import Link                from "next/link";
import Avatar              from "@components/common/Avatar";
import { User }  from "@interfaces/user.interfaces"
import api       from "../../api/index";
import { toast } from "react-toastify";
import { useSelector }     from "react-redux";
import { RootState }       from "@store/index";

interface FollowUserProps {
    user: User
    isFollowing: boolean
}

function FollowUser( { user, isFollowing: defaultIsFollowing }: FollowUserProps ) {

    const { isAuthenticated }             = useSelector( ( state: RootState ) => state.auth )
    const [ isFollowing, setIsFollowing ] = useState<boolean>( defaultIsFollowing )

    async function handleMakeFollowing() {
        try {
            const { data } = await api.follows.addFollowing( user.username )
            toast.success( data.message )
            setIsFollowing( true )
        } catch ( err: any ) {
            toast.error( err.response?.data.message )
        }
    }

    async function handleMakeUnfollowing() {
        try {
            const { data } = await api.follows.removeFollowing( user.username )
            toast.success( data.message )
            setIsFollowing( false )
        } catch ( err: any ) {
            toast.error( err.response?.data.message )
        }
    }

    return (
        <div className="flex box p-4 mb-2">
            <Link href={ `/${ user.username }` }>
                <a className="block min-w-[40px] mr-2">
                    <Avatar src={ user.photo }/>
                </a>
            </Link>
            <div className="w-full">
                <div className="flex justify-between items-center">
                    <Link href={ `/${ user.username }` }>
                        <a className="block">
                            <h3 className="text-md font-medium">
                                { user.fullName }
                            </h3>
                            <h4 className="text-sm text-gray-700">
                                @{ user.username }
                            </h4>
                        </a>
                    </Link>
                    { isAuthenticated && <div>
                        { isFollowing ? (
                            <button onClick={ () => handleMakeUnfollowing() }
                                    className="button-blue rounded-full py-2 px-5">
                                Unfollow
                            </button>
                        ) : (
                            <button onClick={ () => handleMakeFollowing() }
                                    className="button-blue rounded-full py-2 px-5">
                                Follow
                            </button>
                        ) }
                    </div> }
                </div>
                <div className="mt-2">{ user.profile?.bio }</div>
            </div>
        </div>
    )
}

export default FollowUser