import { Metadata } from 'next'
import SidebarLayout from '~/components/global/SidebarLayout'
import NotificationList from '~/components/notifications/NotificationList'

export const metadata: Metadata = {
	title: 'Notifications',
}

export default function NotificationPage() {
	return (
		<SidebarLayout>
			<div className='card py-6 px-4 h-screen-content overflow-y-auto'>
				<h3 className='text-xl lg:text-2xl font-bold text-gray-900 ml-2 mb-3'>Notifications</h3>

				<NotificationList skeletonCount={8} />
			</div>
		</SidebarLayout>
	)
}
