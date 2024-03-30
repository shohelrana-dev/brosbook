import { Metadata } from 'next'
import Login from '~/components/auth/Login'
import siteMetadata from '~/config/siteMetadata'

const title = `Login to ${siteMetadata.appName}`
const description = `Log in to ${siteMetadata.appName} to see the latest. Join the conversation, follow accounts, see your Home Timeline and catch up on posts from the people you know.`

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

export default function LoginPage() {
    return <Login />
}
