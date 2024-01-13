import { Badge, Link as ButtonLink, IconButton, Popover, Tooltip } from '@mui/material'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import Link from 'next/link'
import { IoNotificationsOutline as NotificationIcon } from 'react-icons/io5'
import NotificationList from '~/components/notifications/NotificationList'
import { useGetUnreadNotificationsCountQuery } from '~/services/notificationsApi'

export default function NotificationsNavLink() {
	const { data: unreadNotificationsData } = useGetUnreadNotificationsCountQuery()

	const { count: unreadNotificationsCount = 0 } = unreadNotificationsData || {}

	return (
		<PopupState variant='popover'>
			{popupState => (
				<>
					<div>
						<Tooltip title='Notifications'>
							<IconButton {...bindTrigger(popupState)}>
								<Badge badgeContent={unreadNotificationsCount} color='error'>
									<NotificationIcon size={25} className='text-gray-700' />
								</Badge>
							</IconButton>
						</Tooltip>
					</div>
					<Popover
						{...bindPopover(popupState)}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
					>
						<div className='w-full min-w-80 max-h-130 p-2 overflow-y-auto'>
							<div className='flex flex-wrap justify-between'>
								<h3 className='text-xl font-bold text-gray-900 ml-2 mb-1'>
									Notifications
								</h3>

								<Link href='/notifications' onClick={() => popupState.setOpen(false)}>
									<ButtonLink underline='hover'>See all</ButtonLink>
								</Link>
							</div>

							<NotificationList />
						</div>
					</Popover>
				</>
			)}
		</PopupState>
	)
}
