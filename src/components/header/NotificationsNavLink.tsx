import Link from 'next/link'
import { IoNotificationsOutline as NotificationIcon } from 'react-icons/io5'
import NotificationList from '~/components/notifications/NotificationList'
import IconButton from '~/components/ui/IconButton'
import Tooltip from '~/components/ui/Tooltip'
import { Badge, Popover, PopoverContent, PopoverTrigger } from '~/lib/nextui'
import { useGetUnreadNotificationsCountQuery } from '~/services/notificationsApi'

export default function NotificationsNavLink() {
    const { data: { count } = {} } = useGetUnreadNotificationsCountQuery()

    return (
        <Popover>
            <Tooltip content='Notifications'>
                <Badge content={count} color='danger' isInvisible={!count} className='top-2 right-2'>
                    <PopoverTrigger>
                        <IconButton size='lg'>
                            <NotificationIcon size={25} />
                        </IconButton>
                    </PopoverTrigger>
                </Badge>
            </Tooltip>

            <PopoverContent className='p-0'>
                <div className='w-full min-w-80 max-h-130 p-4 overflow-y-auto'>
                    <div className='flex flex-wrap justify-between'>
                        <h3 className='text-xl font-bold text-gray-900 ml-2 mb-1'>Notifications</h3>

                        <Link
                            href='/notifications'
                            className='text-blue-400 font-semibold hover:underline'
                        >
                            See all
                        </Link>
                    </div>

                    <NotificationList />
                </div>
            </PopoverContent>
        </Popover>
    )
}
