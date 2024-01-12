import { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import { cookies } from 'next/headers'
import { ReactNode } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import '~/assets/styles/app.css'
import PreLoader from '~/components/global/PreLoader'
import Header from '~/components/header/Header'
import { getCurrentUser } from '~/services/index'
import siteMetadata from '~/utils/siteMetadata'
import Providers from './providers'

export const metadata: Metadata = {
	title: {
		default: siteMetadata.title,
		template: `%s | ${siteMetadata.appName}`,
	},
	description: siteMetadata.description,
	keywords: siteMetadata.keywords,
	metadataBase: new URL(siteMetadata.siteUrl),
	applicationName: siteMetadata.appName,
	creator: siteMetadata.creator,
	openGraph: {
		title: siteMetadata.appName,
		description: siteMetadata.description,
		images: siteMetadata.titledLogo,
	},
	twitter: {
		card: 'summary_large_image',
		title: siteMetadata.appName,
		description: siteMetadata.description,
		images: siteMetadata.titledLogo,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
}

const kanit = Kanit({
	weight: ['400', '500', '600'],
	subsets: ['latin'],
	variable: '--font-kanit',
	display: 'swap',
})

interface Props {
	children: ReactNode
	auth: ReactNode
}

export default async function RootLayout({ children, auth }: Props) {
	const user = await getCurrentUser(cookies())

	return (
		<html lang='eng'>
			<head />
			<body className={`${kanit.className} bg-primary-gray`}>
				<Providers>
					<PreLoader user={user!} />
					<Header />
					<main>
						{children}
						{auth}
					</main>
				</Providers>
			</body>
		</html>
	)
}
