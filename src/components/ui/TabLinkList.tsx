'use client'
import { Tab, Tabs } from '@nextui-org/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export interface TabLink {
	label: string
	pathname: string
	icon?: ReactNode
}
interface Props {
	links: TabLink[]
}

export default function TabLinkList({ links }: Props) {
	const currentPathname = usePathname()

	return (
		<div className='flex w-full flex-col'>
			<Tabs
				aria-label='Options'
				color='primary'
				variant='underlined'
				classNames={{
					tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-gray-200',
					cursor: 'w-full',
					tabContent: 'font-medium text-gray-600',
				}}
				selectedKey={currentPathname}
			>
				{links.map(({ label, pathname, icon }) => (
					<Tab
						key={pathname}
						as={Link}
						href={pathname}
						title={
							<div className='flex items-center space-x-2'>
								{icon}
								<span>{label}</span>
							</div>
						}
					/>
				))}
			</Tabs>
		</div>
	)
}
