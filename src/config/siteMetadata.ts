const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook'

const siteMetadata = {
    appName: appName,
    title: `Welcome to ${appName}. Make your own timeline.`,
    description: `A social media platform developed by Shohel Rana.`,
    keywords: [appName, 'social media'],
    creator: 'Shohel Rana',
    siteLogo: '/logo.png',
    titledLogo: '/titled-logo.png',
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://brosbook.vercel.app',
}

export default siteMetadata
