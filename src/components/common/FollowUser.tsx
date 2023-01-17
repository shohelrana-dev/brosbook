import React, { useState } from 'react'
import Link                from "next/link"
import Avatar              from "@components/common/Avatar"
import { User }            from "@interfaces/user.interfaces"
import FollowButton from "@components/common/FollowButton"

interface FollowUserProps {
    user: User
}

function FollowUser( { user }: FollowUserProps ){
    return (
        <div className="flex box p-4 mb-2">
            <Link href={ `/${ user.username }` } className="block min-w-[40px] mr-2">
                <Avatar src={ user.avatar.url }/>
            </Link>
            <div className="w-full">
                <div className="flex justify-between items-center">
                    <Link href={ `/${ user.username }` } className="block">
                            <h3 className="text-md font-medium">
                                { user.fullName }
                            </h3>
                            <h4 className="text-sm text-gray-700">
                                @{ user.username }
                            </h4>
                    </Link>
                    <FollowButton user={user}/>
                </div>
                <div className="mt-2">{ user.profile?.bio }</div>
            </div>
        </div>
    )
}

export default FollowUser