import { ReactNode } from 'react'
import TabLinkList from '@/components/global/TabLinkList'
import Avatar from '@/components/global/Avatar'
import SidebarLayout from '@/components/global/SidebarLayout'
import { getCurrentUser } from '@/services/index'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Your account',
}

const tabLinks = [
	{ label: 'Account', pathname: '/account' },
	{ label: 'Profile', pathname: '/account/profile' }
]

interface Props {
	children: ReactNode
}

export default async function AccountLayout({ children }: Props) {
	const user = await getCurrentUser(cookies())

	return (
		<SidebarLayout>
			<div className='bg-white p-5 rounded-lg lg:rounded-none'>
				<TabLinkList links={tabLinks} />
				<div className='flex flex-wrap items-center mt-5'>
					<div className='w-3/12 flex flex-wrap justify-end p-4'>
						<Avatar src={user?.avatar.url} alt={user?.username} size='large' />
					</div>
					<div className='flex flex-wrap p-4'>
						<h3 className='text-xl font-medium'>{user?.username}</h3>
					</div>
				</div>
				{children}
			</div>
		</SidebarLayout>
	)
}
