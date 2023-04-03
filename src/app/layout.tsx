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
    keywords: [process.env.NEXT_PUBLIC_APP_NAME!, 'social media'],
    colorScheme: "light",
    themeColor: "#FFFFFF",
    applicationName: appName,
    description: `Welcome to ${ appName }. Make your own timeline.`,
    viewport: {
        width: 'device-width',
        initialScale: 1.0,
        minimumScale: 1.0,
        maximumScale: 1.0
    },
    icons: '/favicon.png',
    creator: "Shohel Rana"
}

export default async function RootLayout( { children }: PropsWithChildren ){
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