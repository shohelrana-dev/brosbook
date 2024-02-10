import Link from 'next/link'
import Avatar from '~/components/ui/Avatar'
import { Notification, NotificationTypes } from '~/interfaces/index.interfaces'
import timeAgo from '~/utils/timeAgo'

interface Props {
   notification: Notification
}

function NotificationItem({ notification }: Props) {
   let title = null
   let url = null

   switch (notification.type) {
      case NotificationTypes.FOLLOWED:
         title = 'Started following you.'
         url = `/${notification.initiator.username}`
         break

      case NotificationTypes.LIKED_POST:
         title = 'Liked your post.'
         url = `/posts/${notification.post.id}`
         break

      case NotificationTypes.COMMENTED_POST:
         title = 'Commented on your post.'
         url = `/posts/${notification.post.id}`
         break

      case NotificationTypes.LIKED_COMMENT:
         title = 'Liked your comment.'
         url = `/posts/${notification.post.id}`
         break
   }

   return (
      <Link
         href={url}
         key={notification.id}
         className="mb-1 flex flex-wrap gap-3 hover:bg-gray-100 p-3"
      >
         <Avatar src={notification.initiator.avatar.url} />
         <div>
            <div className="flex gap-2">
               <h3 className="text-sm font-medium text-black">{notification.initiator.fullName}</h3>
               <h4 className="text-xs text-gray-700">@{notification.initiator.username}</h4>
            </div>
            <div className="text-gray-800 flex flex-wrap gap-2 items-center">
               <p>{title}</p>
               <small className="text-gray-600 text-xs">{timeAgo(notification.createdAt)}</small>
            </div>
         </div>
      </Link>
   )
}

export default NotificationItem
