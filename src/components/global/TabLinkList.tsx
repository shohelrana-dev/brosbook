'use client'
import { TabContext, TabList } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface TabLinkListProps {
	links: { label: string; pathname: string }[]
}

export default function TabLinkList({ links }: TabLinkListProps) {
	const currentPathname = usePathname()

	const isCurrentPathExist = !!links.find(({ pathname }) => pathname === currentPathname)?.pathname

	return (
		<Box sx={{ width: '100%', typography: 'body1' }}>
			<TabContext value={isCurrentPathExist ? currentPathname : '/account'}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<TabList aria-label='Tab links'>
						{links.map(({ label, pathname }) => (
							<Tab
								key={pathname}
								label={
									<Link href={pathname} className='px-6 py-4'>
										{label}
									</Link>
								}
								value={pathname}
								sx={{ textTransform: 'inherit', padding: 0 }}
							/>
						))}
					</TabList>
				</Box>
			</TabContext>
		</Box>
	)
}
