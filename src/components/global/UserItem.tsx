import Link from "next/link"
import Avatar from "@components/global/Avatar"
import { User } from "@interfaces/user.interfaces"
import FollowButton from "@components/global/FollowButton"
import TextOverflow from 'react-text-overflow'
import useAuthState from "@hooks/useAuthState"
import {TbDiscountCheckFilled as BlueBadgeIcon} from "react-icons/tb"
import { twMerge } from "tailwind-merge"

interface Props {
    user: User
    hideFollowButton?: boolean
    className?: string
}

export default function UserItem( { user, hideFollowButton = false, className }: Props ){
    const { user: currentUser } = useAuthState()
    const isCurrentUser         = user.id === currentUser?.id

    return (
        <div className={ twMerge( 'flex mb-4 w-full', className ) }>
            <div className="flex w-full">
                <Link href={ `/${ user.username }` } className="inline-block min-w-[40px] mr-3">
                    <Avatar src={ user.avatar.url }/>
                </Link>
                <div className="w-full">
                    <div className="flex justify-between w-full">
                        <div className="flex items-center">
                            <Link href={ `/${ user.username }` } className="block">
                                <h3 className="text-sm font-medium flex items-center">
                                    <TextOverflow text={ user.fullName }/>
                                    <BlueBadgeIcon color="rgb(58,141,245)" size={16} className="ml-[1px]"/>
                                </h3>
                                <h4 className="text-xs text-gray-700">
                                    <TextOverflow text={ `@${ user.username }` }/>
                                </h4>
                            </Link>
                        </div>
                        { ! isCurrentUser && ! hideFollowButton ? (
                            <div>
                                <FollowButton user={ user }/>
                            </div>
                        ) : null }
                    </div>
                    { user.profile?.bio ? <div className="mt-1 text-gray-800">{ user.profile?.bio }</div> : null }
                </div>
            </div>
        </div>
    )
}