'use client'
import { AppBar, Box, Button, IconButton } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '~/assets/images/logo.png'
import titledLogo from '~/assets/images/titled-logo.png'
import MessagesNavLink from '~/components/header/MessagesNavLink'
import NotificationsNavLink from '~/components/header/NotificationsNavLink'
import SearchButton from '~/components/header/SearchButton'
import UserMenu from '~/components/header/UserMenu'
import useAuthState from '~/hooks/useAuthState'
import useMediaQuery from '~/hooks/useMediaQuery'

export default function Header() {
	const isScreenSmall = useMediaQuery('(max-width: 767px)')
	const { isAuthenticated } = useAuthState()
	const pathname = usePathname()

	return (
		<AppBar
			variant='outlined'
			color='default'
			position='static'
			sx={{ background: '#fff', padding: '6px 10px', height: 65 }}
		>
			<div className='container flex flex-wrap items-center justify-between text-gray-900'>
				<Link href='/'>
					{isScreenSmall ? (
						<IconButton>
							<Image
								priority
								src={logo}
								alt={'Brosbook logo'}
								width={31}
								height={40}
								placeholder='blur'
							/>
						</IconButton>
					) : (
						<Image
							priority
							src={titledLogo}
							alt={'Brosbook logo'}
							width={150}
							height={40}
							placeholder='blur'
						/>
					)}
				</Link>
				<Box sx={{ display: 'flex', flexGrow: 1 }} />
				<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
					<SearchButton />
					{isAuthenticated ? (
						<>
							<NotificationsNavLink />
							<MessagesNavLink />
							<UserMenu />
						</>
					) : (
						<>
							&nbsp;
							<Link
								href={`/auth/login${
									pathname.startsWith('/auth') ? '' : '?redirect_to=' + pathname
								}`}
							>
								<Button variant='contained'>Login</Button>
							</Link>
						</>
					)}
				</Box>
			</div>
		</AppBar>
	)
}
