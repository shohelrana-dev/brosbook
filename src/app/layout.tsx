import { PropsWithChildren } from "react"
import { Kanit } from '@next/font/google'
import Providers from "./providers"
import Navbar from "@components/global/Navbar"
import { cookies } from "next/headers"
import '@styles/app.css'
import { Metadata } from "next"

const font = Kanit( { weight: '400' } )

const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Brosbook'

export const metadata: Metadata = {
    title: {
        default: appName,
        template: `%s | ${ appName }`,
    },
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
    icons: '/images/favicon.png',
    creator: "Shohel Rana"
}

export default async function RootLayout( { children }: PropsWithChildren ){
    const hasAccessToken = !! cookies().get( 'access_token' )?.value

    return (
        <html lang='eng' className={ font.className }>
        <head/>
        <body className="bg-theme-gray">
        <Providers>
            <Navbar hasAccessToken={ hasAccessToken }/>
            { children }
        </Providers>
        </body>
        </html>
    )
}