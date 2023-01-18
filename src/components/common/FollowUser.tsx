import React from 'react'
import Link from "next/link"
import Avatar from "@components/common/Avatar"
import { User } from "@interfaces/user.interfaces"
import FollowButton from "@components/common/FollowButton"
import TextOverflow from 'react-text-overflow'

interface FollowUserProps {
    user: User
}

function FollowUser( { user }: FollowUserProps ){
    return (
        <div className="flex mb-2 w-full">
            <div className="flex w-full">
                <Link href={ `/${ user.username }` } className="inline-block min-w-[40px] mr-3">
                    <Avatar src={ user.avatar.url }/>
                </Link>
                <div className="w-full">
                    <div className="flex justify-between w-full">
                        <div className="flex items-center">
                            <Link href={ `/${ user.username }` } className="block">
                                <h3 className="text-sm font-medium">
                                    <TextOverflow text={ user.fullName }/>
                                </h3>
                                <h4 className="text-xs text-gray-700">
                                    <TextOverflow text={ `@${ user.username }` }/>
                                </h4>
                            </Link>
                        </div>
                        <div>
                            <FollowButton user={ user }/>
                        </div>
                    </div>
                    { user.profile?.bio ? <div className="mt-2 text-gray-800">{ user.profile?.bio }</div> : null }
                </div>
            </div>
        </div>
    )
}

export default FollowUser


/*
 <div>
 { user.profile?.bio ? <div className="mt-2">{ user.profile?.bio }</div> : null }
 </div>*/
