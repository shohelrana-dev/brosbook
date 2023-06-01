import '@assets/styles/app.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { PropsWithChildren } from "react"
import Providers from "./providers"
import Navbar from "@components/navbar/Navbar"
import { Metadata } from "next"
import { getCurrentUser } from "@services/index"
import { cookies } from "next/headers"
import PreLoader from "@components/global/PreLoader"

const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook'

export const metadata: Metadata = {
    title: {
        default: appName,
        template: `%s | ${ appName }`,
    },
    description: `Welcome to ${ appName }. Make your own timeline.`,
    keywords: [process.env.NEXT_PUBLIC_APP_NAME!, 'social media'],
    metadataBase: new URL( process.env.NEXT_PUBLIC_APP_URL! ),
    colorScheme: "light",
    themeColor: "#FFFFFF",
    applicationName: appName,
    viewport: {
        width: 'device-width',
        initialScale: 1.0,
        minimumScale: 1.0,
        maximumScale: 1.0
    },
    creator: "Shohel Rana",
    openGraph: {
        title: process.env.NEXT_PUBLIC_APP_NAME,
        description: 'A social media platform developed by Shohel Rana',
        images: '/titled-logo.png'
    },
    twitter: {
        title: process.env.NEXT_PUBLIC_APP_NAME,
        description: 'A social media platform developed by Shohel Rana',
        images: '/titled-logo.png'
    }
}

export default async function RootLayout( { children }: PropsWithChildren ) {
    const user = await getCurrentUser( cookies() )

    return (
        <html lang='eng'>
        <head/>
        <body className="bg-theme-gray">
        <Providers>
            <PreLoader user={ user! }/>
            <Navbar/>
            <main className="relative">
                { children }
            </main>
        </Providers>
        </body>
        </html>
    )
}