import React from 'react'
import Avatar from "@components/common/Avatar"
import Link from "next/link"
import { Notification, NotificationTypes } from "@interfaces/index.interfaces"
import useCurrentUser from "@hooks/useCurrentUser"
import timeAgo from "@utils/timeAgo"

interface Props {
    notification: Notification
}

function NotificationItem( { notification }: Props ){
    const { user } = useCurrentUser()

    let title = null
    let url   = null

    switch ( notification.type ) {
        case NotificationTypes.FOLLOWED:
            title = 'Started following you.'
            url   = `/${ notification.initiator.username }`
            break

        case NotificationTypes.LIKED_POST:
            title = 'Liked your post.'
            url   = `/${ user?.username }/posts/${ notification.post.id }`
            break

        case NotificationTypes.COMMENTED_POST:
            title = 'Commented on your post.'
            url   = `/${ user?.username }/posts/${ notification.post.id }`
            break

        case NotificationTypes.LIKED_COMMENT:
            title = 'Liked your comment.'
            url   = `/${ user?.username }/posts/${ notification.post.id }`
            break
    }

    return (
        <Link href={ url } key={ notification.id } className="mb-1 flex gap-3 hover:bg-gray-100 p-3">
            <Avatar src={ notification.initiator.avatar.url }/>
            <div>
                <div className="flex gap-2">
                    <h3 className="text-base font-medium">
                        { notification.initiator.fullName }
                    </h3>
                    <h4 className="text-sm text-gray-700">
                        @{ notification.initiator.username }
                    </h4>
                </div>
                <p className="text-gray-700">
                    { title }
                    <small className="text-gray-600 ml-3">
                        { timeAgo( notification.createdAt ) }
                    </small>
                </p>
            </div>
        </Link>
    )
}

export default NotificationItem