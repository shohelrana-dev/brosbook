import { Metadata } from 'next'
import Signup from '~/components/auth/Signup'
import siteMetadata from '~/utils/siteMetadata'

const title = `Signup for ${siteMetadata.appName}`
const description = `Sign up for a ${siteMetadata.appName} account. From breaking news and entertainment to sports and politics, get the full story with all the live commentary.`

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description,
		images: siteMetadata.titledLogo,
	},
	twitter: {
		title,
		description,
		images: siteMetadata.titledLogo,
		card: 'summary_large_image',
	},
}

export default function SignupPage() {
	return <Signup />
}
