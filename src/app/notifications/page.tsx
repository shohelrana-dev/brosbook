import { Metadata } from 'next'
import SidebarLayout from '~/components/global/SidebarLayout'
import NotificationList from '~/components/notifications/NotificationList'

export const metadata: Metadata = {
	title: 'Notifications',
}

export default function NotificationPage() {
	return (
		<SidebarLayout>
			<div className='card py-6 px-4'>
				<NotificationList />
			</div>
		</SidebarLayout>
	)
}
