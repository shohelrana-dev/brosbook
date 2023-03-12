import { PropsWithChildren } from "react"
import { Kanit } from 'next/font/google'
import Providers from "./providers"
import Navbar from "@components/navbar/Navbar"
import { Metadata } from "next"
import '@assets/styles/app.css'

const font = Kanit( { weight: '400' } )

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

export default function RootLayout( { children }: PropsWithChildren ){
    return (
        <html lang='eng' className={ font.className }>
        <head/>
        <body className="bg-theme-gray">
        <Providers>
            <Navbar/>
            { children }
        </Providers>
        </body>
        </html>
    )
}